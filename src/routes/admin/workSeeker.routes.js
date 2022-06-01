const express = require("express");
const { validate } = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const controller = require("../../controllers/admin/workSeeker.controller");
const validation = require("../../validations/admin/workSeeker.validation");
const { USER_TYPE } = require("../../config/appConstants");

const router = express.Router();

router
  .route("/")
  .get(
   auth(USER_TYPE.ADMIN),
    validate(validation.getWorkSeekers),
    controller.getWorkSeekers
  )
  .delete(
    auth(USER_TYPE.ADMIN),
    validate(validation.deleteWorkSeeker),
    controller.deleteWorkSeeker
  );

router.put(
  "/block",
  auth(USER_TYPE.ADMIN),
  validate(validation.block),
  controller.block
);

module.exports = router;
