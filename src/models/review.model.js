const mongoose = require("mongoose");
const { SKILL_LEVEL } = require("../config/appConstants");

const reatedSkillsSchema = mongoose.Schema({
  skillName: { type: String, required: true },
  requiredLevel: { type: Number, enum: [...Object.values(SKILL_LEVEL)] },
  ratedLevel: { type: Number, enum: [...Object.values(SKILL_LEVEL)] },
});

const reviewSchema = mongoose.Schema(
  {
    reviewer: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "users",
      required: true,
    },
    rating: { type: Number, required: true },
    review: { type: String, required: true },
    ratedSkills: {
      hardSkills: [reatedSkillsSchema],
      softSkills: [reatedSkillsSchema],
      tooling: [reatedSkillsSchema],
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("reviews", reviewSchema);

module.exports = Review;
