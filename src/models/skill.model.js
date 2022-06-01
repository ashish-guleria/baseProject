const mongoose = require("mongoose");

const SkillSchema = mongoose.Schema({
  enName: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
});

const Skill = mongoose.model("skills", SkillSchema);

module.exports = Skill;
