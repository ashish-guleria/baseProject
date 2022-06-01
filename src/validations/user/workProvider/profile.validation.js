const Joi = require("joi");
const { JOI } = require("../../../config/appConstants");

exports.editProfile = {
  body: Joi.object().keys({
    profileImage: Joi.string().allow(""),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    countryCode: Joi.string().required(),
    phoneNumber: JOI.PHONENUMBER,
    country: Joi.string().required(),
    businessName: Joi.string().required(),
    companyNumber: Joi.string().allow(""),
    address: Joi.object().keys({
      address: Joi.string().required(),
      city: Joi.string(),
      country: Joi.string().required(),
      postalCode: Joi.number(),
      longitude: Joi.number().required(),
      latitude: Joi.number().required(),
    }),
    vatNumber: Joi.string().allow(""),
  }),
};
