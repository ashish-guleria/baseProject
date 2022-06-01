const bcrypt = require("bcryptjs");

const { User, Token } = require("../../models");
const { ApiError } = require("../../utils/universalFunction");
const {
  joi,
  loginType,
  USER_TYPE,
  STATUS_CODES,
  ERROR_MESSAGES,
  POPULATE_SKILLS,
} = require("../../config/appConstants");
const { OperationalError } = require("../../utils/errors");
const config = require("../../config/config");
const stripe = require("stripe")(config.stripe.secretKey);

const createUser = async (userBody) => {
  let query = {
    email: userBody.email,
  };

  let updateBody = {};
  if (USER_TYPE.WORK_PROVIDER === userBody.signupAs) {
    query = {
      ...query,
      workProviders: { $elemMatch: { isDeleted: false } },
    };
    updateBody = { $push: { workProviders: userBody } };
  }

  if (USER_TYPE.WORK_SEEKER === userBody.signupAs) {
    query = {
      ...query,
      workSeekers: { $elemMatch: { isDeleted: false } },
    };
    updateBody = {
      $push: { workSeekers: userBody },
    };
  }

  if (await User.findOne(query)) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.EMAIL_ALREADY_EXIST
    );
  }

  const stripeCustomer = await stripe.customers.create({
    phone: userBody.countryCode + userBody.phoneNumber,
    email: userBody.email,
  });

  userBody.password = await bcrypt.hash(userBody.password, 8);
  userBody.stripe = { customerId: stripeCustomer.id };

  const updatedUser = await User.findOneAndUpdate(
    {
      email: userBody.email,
    },
    updateBody,
    {
      new: true,
      lean: true,
      upsert: true,
    }
  );

  return updatedUser;
};

const userLogin = async (email, password, loginAs) => {
  const user = await User.findOne({ email }).populate(POPULATE_SKILLS).lean();
  if (!user) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.EMAIL_NOT_FOUND
    );
  }

  //formatUser(user, loginAs);
  let userPassword;
  let freezeAccount = {};
  if (loginAs === USER_TYPE.WORK_SEEKER) {
    if (!user.workSeekers.length) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.ACCOUNT_NOT_EXIST
      );
    }
    userPassword = user.workSeekers[user.workSeekers.length - 1].password;
    freezeAccount = {
      [`workSeekers.${user.workSeekers.length - 1}.isAccountFreeze`]: false,
    };
  }
  if (loginAs === USER_TYPE.WORK_PROVIDER) {
    if (!user.workProviders.length) {
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.ACCOUNT_NOT_EXIST
      );
    }
    userPassword = user.workProviders[user.workProviders.length - 1].password;
    freezeAccount = {
      [`workProviders.${user.workProviders.length - 1}.isAccountFreeze`]: false,
    };
  }

  if (!(await bcrypt.compare(password, userPassword))) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.WRONG_PASSWORD
    );
  }
  await User.findByIdAndUpdate(user._id, freezeAccount);
  return user;
};

const getUserById = async (userId) => {
  const user = await User.findById(userId).lean();

  if (!user) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
  return user;
};

const findOneAndUpdate = async (_id, updateBody) => {
  const result = User.findOneAndUpdate({ _id }, updateBody, { new: true });
  return result;
};

const resetPassword = async (tokenData, newPassword) => {
  let query = { _id: tokenData.user };
  let updateBody = {};
  newPassword = await bcrypt.hash(newPassword, 8);
  if (tokenData.role === USER_TYPE.WORK_PROVIDER) {
    query = {
      ...query,
      workProviders: {
        $elemMatch: { _id: tokenData.workProvider },
      },
    };
    updateBody = {
      ...updateBody,
      "workProviders.$.password": newPassword,
    };
  }

  if (tokenData.role === USER_TYPE.WORK_SEEKER) {
    query = {
      ...query,
      workSeekers: {
        $elemMatch: { _id: tokenData.workSeeker },
      },
    };
    updateBody = {
      ...updateBody,
      "workSeekers.$.password": newPassword,
    };
  }

  await Promise.all([
    User.findOneAndUpdate(query, updateBody),
    Token.findByIdAndUpdate(tokenData._id, { isDeleted: true }),
  ]);

  //return user;
};

module.exports = {
  userLogin,
  getUserById,
  createUser,
  findOneAndUpdate,
  resetPassword,
};
