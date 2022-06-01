const Joi = require("joi");
const {
  JOI,
  skillTypes,
  SKILL_LEVEL,
} = require("../../../config/appConstants");

exports.editBasicInfo = {
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
      address: Joi.string(),
      city: Joi.string(),
      country: Joi.string(),
      postalCode: Joi.number(),
      longitude: Joi.number(),
      latitude: Joi.number(),
    }),
    vatNumber: Joi.string().allow(""),
    hourlyRate: Joi.number().required(),
  }),
};

exports.editSkills = {
  body: Joi.object().keys({
    hardSkills: Joi.array()
      .items(
        Joi.object().keys({
          skill: JOI.OBJECTID,
          level: Joi.number()
            .valid(...Object.values(SKILL_LEVEL))
            .required(),
        })
      )
      .required(),
    softSkills: Joi.array()
      .items(
        Joi.object().keys({
          skill: JOI.OBJECTID,
          level: Joi.number()
            .valid(...Object.values(SKILL_LEVEL))
            .required(),
        })
      )
      .required(),
    tooling: Joi.array()
      .items(
        Joi.object().keys({
          skill: JOI.OBJECTID,
          level: Joi.number()
            .valid(...Object.values(SKILL_LEVEL))
            .required(),
        })
      )
      .required(),
  }),
};

exports.editCertificates = {
  body: Joi.array().items(
    Joi.object().keys({
      image: Joi.string().required(),
      title: Joi.string().required(),
      skill: JOI.OBJECTID,
    })
  ),
};

exports.editExperience = {
  body: Joi.object().keys({
    level: Joi.number()
      .valid(...Object.values(SKILL_LEVEL))
      .required(),
    positions: Joi.array()
      .items(
        Joi.object().keys({
          title: Joi.string().required(),
          company: Joi.string().required(),
          joinDt: Joi.string().required(),
          finishDt: Joi.string().required(),
        })
      )
      .required(),
  }),
};

exports.editVideoIntro = {
  body: Joi.object().keys({
    thumbnail: Joi.string().required(),
    video: Joi.string().required(),
  }),
};

exports.language = {
  body: Joi.array().items(
    Joi.object().keys({
      language: Joi.string().required(),
      read: Joi.boolean().required(),
      write: Joi.boolean().required(),
      verbal: Joi.boolean().required(),
    })
  ),
};
