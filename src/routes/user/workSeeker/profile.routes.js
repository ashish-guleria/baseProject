const express = require("express");
const auth = require("../../../middlewares/auth");
const { validate, validateView } = require("../../../middlewares/validate");
const userValidation = require("../../../validations/user/workSeeker/profile.validation");
const userController = require("../../../controllers/user/workSeeker/profile.controller");
const { USER_TYPE } = require("../../../config/appConstants");

const router = express.Router();

router.put(
  "/basicInfo",
  auth(USER_TYPE.WORK_SEEKER),
  validate(userValidation.editBasicInfo),
  userController.editBasicInfo
);
router.put(
  "/skills",
  auth(USER_TYPE.WORK_SEEKER),
  validate(userValidation.editSkills),
  userController.editSkills
);

router.put(
  "/certificates",
  auth(USER_TYPE.WORK_SEEKER),
  validate(userValidation.editCertificates),
  userController.editCertificates
);

router.put(
  "/experience",
  auth(USER_TYPE.WORK_SEEKER),
  validate(userValidation.editExperience),
  userController.editExperience
);

router.put(
  "/videoIntro",
  auth(USER_TYPE.WORK_SEEKER),
  validate(userValidation.editVideoIntro),
  userController.editVideoIntro
);

router.put(
  "/language",
  auth(USER_TYPE.WORK_SEEKER),
  validate(userValidation.language),
  userController.language
);

module.exports = router;
