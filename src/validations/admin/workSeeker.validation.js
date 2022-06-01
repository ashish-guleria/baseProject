const Joi = require("joi");
const { JOI } = require("../../config/appConstants");

exports.getWorkSeekers = {
  query: Joi.object().keys({
    search: Joi.string().allow(""),
    limit: JOI.LIMIT,
    page: JOI.PAGE,
  }),
};

exports.block = {
  body: Joi.object().keys({
    userId: JOI.OBJECTID,
  }),
};

exports.deleteWorkSeeker = {
  query: Joi.object().keys({
    userId: JOI.OBJECTID,
  }),
};

