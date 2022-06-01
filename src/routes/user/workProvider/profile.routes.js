const express = require("express");
const auth = require("../../../middlewares/auth");
const { validate } = require("../../../middlewares/validate");
const validation = require("../../../validations/user/workProvider/profile.validation");
const controller = require("../../../controllers/user/workProvider/profile.controller");
const { USER_TYPE } = require("../../../config/appConstants");

const router = express.Router();
router.put(
  "/",
  auth(USER_TYPE.WORK_PROVIDER),
  validate(validation.editProfile),
  controller.editProfile
);
module.exports = router;
