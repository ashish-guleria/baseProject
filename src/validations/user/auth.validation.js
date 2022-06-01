const Joi = require("joi");
const { JOI, loginType, USER_TYPE } = require("../../config/appConstants");

exports.signup = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: JOI.EMAIL,
    countryCode: Joi.string(),
    phoneNumber: JOI.PHONENUMBER,
    businessName: Joi.string().required(),
    country: Joi.string().required(),
    password: JOI.PASSWORD,
    signupAs: JOI.USER_TYPE,
    deviceType: JOI.DEVICE_TYPE,
    deviceToken: Joi.string().required(),
  }),
};

exports.login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    deviceType: JOI.DEVICE_TYPE,
    deviceToken: Joi.string(),
    loginAs: JOI.USER_TYPE,
  }),
};

exports.forgotPassword = {
  body: Joi.object().keys({
    email: JOI.EMAIL,
    userType: JOI.USER_TYPE,
  }),
};

exports.forgotPage = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

exports.resetForgotPassword = {
  body: Joi.object().keys({
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.any()
      .valid(Joi.ref("newPassword"))
      .required()
      .messages({ "any.only": "Password does not match" }),
  }),
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};
