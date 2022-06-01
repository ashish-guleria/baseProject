const Joi = require("joi");
const { JOI, SKILL_LEVEL } = require("../../../config/appConstants");

exports.getWorkSeekers = {
  body: Joi.object().keys({
    page: JOI.PAGE,
    limit: JOI.LIMIT,
    longitude: Joi.number(),
    latitude: Joi.number(),
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
