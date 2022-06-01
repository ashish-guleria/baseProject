const mongoose = require("mongoose");
const {
  WORK_LOCATION,
  SKILL_LEVEL,
  ASSIGNMENT_STATUS,
  USER_TYPE,
  STATUS,
} = require("../config/appConstants");
const skill = {
  name: { type: String, required: true },
  type: {
    type: Number,
    required: true,
    enum: [...Object.values(SKILL_LEVEL)],
  },
};

const negotiationSchema = mongoose.Schema(
  {
    createdBY: {
      type: String,
      enum: [USER_TYPE.WORK_PROVIDER, USER_TYPE.WORK_SEEKER],
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    customTime: [
      {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        selectedDate: { type: String, required: true },
      },
    ],
    amountPerHour: { type: Number, required: true },
    totalOffer: { type: Number, required: true },
    totalHours: { type: Number, required: true },
  },
  { timestamps: true }
);

const assignmentSchema = mongoose.Schema(
  {
    createdBY: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "users",
      required: true,
    },
    workSeeker: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "users",
    },
    environment: { type: String, required: true },
    tasks: { type: String, required: true },
    result: { type: String },
    valueAdd: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    customTime: [
      {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        selectedDate: { type: String, required: true },
      },
    ],
    minBudget: { type: Number, required: true },
    maxbudget: { type: Number, required: true },
    WORK_LOCATION: {
      type: String,
      enum: [...Object.values(WORK_LOCATION)],
      required: true,
    },
    language: [{ type: String }],
    experience: {
      type: Number,
      enum: [...Object.values(SKILL_LEVEL)],
      required: true,
    },
    hardSkill: [skill],
    softSkill: [skill],
    tooling: [skill],

    totalOffer: { type: Number, required: true },
    perHouramount: { type: Number, required: true },
    totalHours: { type: Number, required: true },
    negotiation: [negotiationSchema],
    status: {
      type: String,
      enum: [...Object.values(ASSIGNMENT_STATUS)],
      required: true,
    },
    proposedStatus: {
      actionDoneBy: {
        type: String,
        enm: [USER_TYPE.WORK_PROVIDER, USER_TYPE.WORK_SEEKER],
      },
      status: { type: String, enum: [...Object.values(STATUS)] },
    },
  },
  {
    timestamps: true,
  }
);

const Assignment = mongoose.model("assignments", assignmentSchema);

module.exports = Assignment;
