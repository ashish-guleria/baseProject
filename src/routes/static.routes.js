const express = require("express");

const router = express.Router();

router.get("/termAndConditions", (req, res) => {
  return res.render("term&conditions");
});
module.exports = router;