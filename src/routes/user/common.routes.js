const express = require("express");
const auth = require("../../middlewares/auth");
const { validate } = require("../../middlewares/validate");
const validation = require("../../validations/user/common.validation");
const controller = require("../../controllers/user/common.controller");

const router = express.Router();

router.put(
  "/changePassword",
  auth(),
  validate(validation.changePassword),
  controller.changePassword
);

router.put("/toggleNotifiation", auth(), controller.toggleNotification);

router.put("/freezeAccount", auth(), controller.freezeAccount);

router.get("/profile", auth(), controller.getProfile);

router
  .route("/skill")
  .post(validate(validation.addSkill), controller.addSkill)
  .get(controller.getSkills);

router
  .route("/payment/card")
  .post(auth(), validate(validation.addCard), controller.addCard)
  .delete(auth(), validate(validation.deleteCard), controller.deleteCard)
  .get(auth(), controller.getCards);

router.put(
  "/payment/card/default",
  auth(),
  validate(validation.makeDefaultCard),
  controller.makeDefaultCard
);

module.exports = router;
