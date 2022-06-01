const Joi = require("joi");
const { joi, loginType, USER_TYPE } = require("../../config/appConstants");

exports.changePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  }),
};

exports.addSkill = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

exports.addCard = {
  body: Joi.object().keys({
    cardToken: Joi.string().required(),
  }),
};

exports.deleteCard = {
  query: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
};

exports.makeDefaultCard = {
  body: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
};
