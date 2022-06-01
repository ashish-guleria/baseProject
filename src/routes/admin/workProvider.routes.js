const express = require("express");
const { validate } = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const userController = require("../../controllers/admin/workProvider.controller");
const userValidation = require("../../validations/admin/workProvider.validation");
const { USER_TYPE } = require("../../config/appConstants");

const router = express.Router();

router
  .route("/")
  .get(
    auth(USER_TYPE.ADMIN),
    validate(userValidation.getUsers),
    userController.getUsers
  )
  .delete(
    auth(USER_TYPE.ADMIN),
    validate(userValidation.deleteWorkProvider),
    userController.deleteWorkProvider
  );
router.get(
  "/single",
  auth(USER_TYPE.ADMIN),
  validate(userValidation.getUser),
  userController.getUser
);
router.put(
  "/block",
  auth(USER_TYPE.ADMIN),
  validate(userValidation.block),
  userController.block
);

module.exports = router;
