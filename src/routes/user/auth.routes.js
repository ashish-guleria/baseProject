const express = require("express");
const auth = require("../../middlewares/auth");
const { validate, validateView } = require("../../middlewares/validate");
const validation = require("../../validations/user/auth.validation");
const controller = require("../../controllers/user/auth.controller");

const router = express.Router();

router.post("/signup", validate(validation.signup), controller.signup);

router.post("/login", validate(validation.login), controller.login);

router.post("/refreshToken", auth(), controller.refreshTokens);

router.post("/logout", auth(), controller.logout);

router.post(
  "/forgotPassword",
  validate(validation.forgotPassword),
  controller.forgotPassword
);

router
  .route("/resetPassword")
  .get(validateView(validation.forgotPage), controller.forgotPage)
  .post(
    validateView(validation.resetForgotPassword),
    controller.resetForgotPassword
  );

module.exports = router;
