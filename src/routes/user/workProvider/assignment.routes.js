const express = require("express");
const auth = require("../../../middlewares/auth");
const { validate } = require("../../../middlewares/validate");
const validation = require("../../../validations/user/workProvider/assignment.validation");
const controller = require("../../../controllers/user/workProvider/assignment.controller");
const { USER_TYPE } = require("../../../config/appConstants");


const router = express.Router();
router.get(
  "/workSeekers",
  auth(USER_TYPE.WORK_PROVIDER),
  validate(validation.getWorkSeekers),
  controller.getWorkSeekers
);
module.exports = router;
