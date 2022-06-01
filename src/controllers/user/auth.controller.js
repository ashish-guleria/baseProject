const { tokenService, authService } = require("../../services");
const {
  USER_TYPE,
  SUCCESS_MESSAGES,
  STATUS_CODES,
  ERROR_MESSAGES,
} = require("../../config/appConstants");
const { catchAsync } = require("../../utils/universalFunction");
const config = require("../../config/config");
const { formatUser } = require("../../utils/formatResponse");
const { forgotPasswordEmail } = require("../../libs/sendMail");
const { successResponse } = require("../../utils/response");
const { OperationalError } = require("../../utils/errors");

const signup = catchAsync(async (req, res) => {
  const user = await authService.createUser(req.body);
  formatUser(user, req.body.signupAs);
  const accessToken = await tokenService.generateAuthToken(
    user,
    req.body.signupAs,
    req.body.deviceToken,
    req.body.deviceType
  );

  //let formatedUser = formatWorkSeeker(user.toObject(), req.headers.timezone);
  // return res.send(
  //   successMessage("en", SUCCESS.DEFAULT, {
  //     // tokenData: accessToken,
  //     // user: formatedUser,
  //   })
  // );

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    {
      tokenData: accessToken,
      user,
    }
  );
});

const login = catchAsync(async (req, res) => {
  let { email, password, loginAs } = req.body;
  const user = await authService.userLogin(email, password, loginAs);
  formatUser(user, loginAs);
  if (loginAs === USER_TYPE.WORK_PROVIDER && user.workProvider.isDeleted) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_DELETED
    );
  }
  if (loginAs === USER_TYPE.WORK_SEEKER && user.workSeeker.isDeleted) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_DELETED
    );
  }
  if (loginAs === USER_TYPE.WORK_PROVIDER && user.workProvider.isBlocked) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_BLOCKED
    );
  }
  if (loginAs === USER_TYPE.WORK_SEEKER && user.workSeeker.isBlocked) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_BLOCKED
    );
  }

  const token = await tokenService.generateAuthToken(
    user,
    req.body.loginAs,
    req.body.deviceToken,
    req.body.DEVICE_TYPE
  );

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    { token, user }
  );
});

const refreshTokens = catchAsync(async (req, res) => {
  const token = await tokenService.refreshAuth(
    req.token.user,
    req.token.role,
    req.token._id,
    req.token.device
  );
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    { token }
  );
  // return res.send(successMessage("en", SUCCESS.DEFAULT, token));
});

const logout = catchAsync(async (req, res) => {
  await tokenService.logout(req.token._id);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.LOGOUT
  );
});

const forgotPassword = catchAsync(async (req, res) => {
  const data = await tokenService.generateResetPasswordToken(
    req.body.email,
    req.body.userType
  );

  forgotPasswordEmail(
    req.body.email,
    data.resetPasswordToken,
    req.body.userType === USER_TYPE.WORK_PROVIDER
      ? data.user.workProvider.firstName + " " + data.user.workProvider.lastName
      : data.user.workSeeker.firstName + " " + data.user.workSeeker.lastName
  );

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS
  );
});

const forgotPage = catchAsync(async (req, res) => {
  try {
    const tokenData = await tokenService.verifyResetPasswordToken(
      req.query.token
    );

    if (tokenData) {
      return res.render("./forgotPassword/forgotPassword", {
        title: "Forgot Password",
        token: req.query.token,
        projectName: config.projectName,
      });
    }
    return res.render("commonMessage", {
      title: "Forgot Password",
      errorMessage: "Sorry, this link has been expired",
      projectName: config.projectName,
    });
  } catch (error) {
    res.render("commonMessage", {
      title: "Forgot Password",
      errorMessage: "Sorry, this link has been expired",
      projectName: config.projectName,
    });
  }
});

const resetForgotPassword = catchAsync(async (req, res) => {
  try {
    const token = req.query.token;
   
    const tokenData = await tokenService.verifyResetPasswordToken(token);

    if (!tokenData)
      return res.render("commonMessage", {
        title: "Forgot Password",
        errorMessage: "Sorry, this link has been expiredsss",
        projectName: config.projectName,
      });

    await authService.resetPassword(tokenData, req.body.newPassword);
    return res.render("commonMessage", {
      title: "Forgot Password",
      successMessage: "Your password is successfully changed",
      projectName: config.projectName,
    });
  } catch (error) {
   
    res.render("commonMessage", {
      title: "Forgot Password",
      errorMessage: "Sorry, this link has been expiredxxx",
      projectName: config.projectName,
    });
  }
});

module.exports = {
  signup,
  login,
  refreshTokens,
  logout,
  forgotPassword,
  forgotPage,
  resetForgotPassword,
};
