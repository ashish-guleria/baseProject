const jwt = require("jsonwebtoken");
const moment = require("moment");
var ObjectID = require("mongodb").ObjectID;

const config = require("../config/config");
const {
  TOKEN_TYPE,
  USER_TYPE,
  STATUS_CODES,
  ERROR_MESSAGES,
} = require("../config/appConstants");
const { Token } = require("../models");
const { workSeekerProfileService } = require("../services");
const { OperationalError } = require("../utils/errors");
const { formatUser } = require("../utils/formatResponse");

const generateToken = (data, secret = config.jwt.secret) => {
  const payload = {
    // user: data.user,
    exp: data.tokenExpires.unix(),
    type: data.tokenType,
    id: data.tokenId,
    role: data.userType,
  };

  return jwt.sign(payload, secret);
};

const saveToken = async (data) => {
  let dataToBesaved = {
    expires: data.tokenExpires.toDate(),
    type: data.tokenType,
    _id: data.tokenId,
    device: { type: data.deviceType, token: data.deviceToken },
    role: data.userType,
    token: data.token,
  };
  if (data.userType === USER_TYPE.ADMIN) {
    dataToBesaved.admin = data.user._id;
  } else {
    data.userType == USER_TYPE.WORK_SEEKER
      ? (dataToBesaved.workSeeker = data.user.workSeeker._id)
      : (dataToBesaved.workProvider = data.user.workProvider._id);
    dataToBesaved.user = data.user._id;
  }

  const tokenDoc = await Token.create(dataToBesaved);
  return tokenDoc;
};

const generateAuthToken = async (user, userType, deviceToken, deviceType) => {
  const tokenExpires = moment().add(config.jwt.accessExpirationMinutes, "days");

  var tokenId = new ObjectID();
  const accessToken = generateToken({
    // user: user._id,
    tokenExpires,
    tokenType: TOKEN_TYPE.ACCESS,
    userType,
    tokenId,
  });

  await saveToken({
    token: accessToken,
    tokenExpires,
    tokenId,
    deviceToken,
    deviceType,
    tokenType: TOKEN_TYPE.ACCESS,
    userType,
    user,
  });
  return {
    token: accessToken,
    expires: tokenExpires.toDate(),
  };
};

const verifyToken = async (token) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({
    token,
    type: payload.type,
    user: payload.userId,
  });
  if (!tokenDoc) {
    throw new Error("Token not found");
  }
  return tokenDoc;
};

const refreshAuth = async (user, userType, tokenId, device) => {
  await Token.findByIdAndUpdate(tokenId, { isDeleted: true });
  return generateAuthToken(user, userType, device.token, device.type);
};

const logout = async (tokenId) => {
  const token = await Token.findOne({ _id: tokenId, isDeleted: false });

  if (!token) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.AUTHENTICATION_FAILED
    );
  }
  const updatedToken = await Token.findByIdAndUpdate(tokenId, {
    isDeleted: true,
  });
  return updatedToken;
};

const generateResetPasswordToken = async (email, userType) => {
  const user = await workSeekerProfileService.getUserByEmail(email);
  if (userType === USER_TYPE.WORK_PROVIDER && !user.workProviders.length) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
  if (userType === USER_TYPE.WORK_SEEKER && !user.workSeekers.length) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
  formatUser(user, userType);
  if (userType === USER_TYPE.WORK_SEEKER) {
    if (user.workSeeker.isDeleted) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.ACCOUNT_DELETED
      );
    }

    if (user.workSeeker.isBlocked) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.ACCOUNT_BLOCKED
      );
    }
  }

  if (userType === USER_TYPE.WORK_PROVIDER) {
    if (user.workProvider.isDeleted) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.ACCOUNT_DELETED
      );
    }

    if (user.workProvider.isBlocked) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.ACCOUNT_BLOCKED
      );
    }
  }

  var tokenId = new ObjectID();
  const tokenExpires = moment().add(
    config.jwt.resetPasswordExpirationMinutes,
    "day"
  );
  const resetPasswordToken = generateToken({
    user: user.id,
    tokenId,
    tokenExpires,
    tokenType: TOKEN_TYPE.RESET_PASSWORD,
  });
  await saveToken({
    token: resetPasswordToken,
    tokenId,
    resetPasswordToken,
    user,
    tokenExpires,
    tokenType: TOKEN_TYPE.RESET_PASSWORD,
    userType,
  });
  return { resetPasswordToken, user };
};

const verifyResetPasswordToken = async (token) => {
  try {
    const payload = jwt.verify(token, config.jwt.secret);

    const tokenData = await Token.findOne({
      _id: payload.id,
      isDeleted: false,
      // expires: { $gte: new Date() },
    });
    return tokenData;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateAuthToken,
  saveToken,
  refreshAuth,
  logout,
  verifyToken,
  generateResetPasswordToken,
  verifyResetPasswordToken,
};
