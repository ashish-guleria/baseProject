const Joi = require("joi");
const { JOI } = require("../../config/appConstants");
const { objectId } = require("../custom.validation");

exports.getUsers = {
  query: Joi.object().keys({
    limit: JOI.LIMIT,
    page: JOI.PAGE,
    search: Joi.string().allow(""),
  }),
};

exports.deleteWorkProvider = {
  query: Joi.object().keys({
    userId: JOI.OBJECTID,
  }),
};
exports.getUser = {
  query: Joi.object().keys({
    userId: JOI.OBJECTID,
  }),
};

exports.block = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};
