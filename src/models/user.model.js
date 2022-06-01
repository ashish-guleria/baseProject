const mongoose = require("mongoose");
const { SKILL_LEVEL } = require("../config/appConstants");
const { AddressSchema } = require("./common");

const BasicInfo = {
  profileImage: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  countryCode: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  country: { type: String, required: true },
  address: AddressSchema,
  vatNumber: { type: String },
  businessName: { type: String },
  companyNumber: { type: String },
  password: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  stripe: {
    customerId: { type: String, required: true },
    defaultCard: { type: String, default: "" },
  },
};

const WorkProviderSchema = mongoose.Schema(
  {
    ...BasicInfo,
    sendNotification: { type: Boolean, default: true },
    isAccountFreeze: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SkillSchema = mongoose.Schema(
  {
    skill: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "skills",
      required: true,
    },
    // name: { type: String, required: true },
    level: {
      type: Number,
      required: true,
      enum: [...Object.values(SKILL_LEVEL)],
      required: true,
    },
  },
  {
    _id: false,
    timestamps: true,
  }
);

const CertificatesSchema = mongoose.Schema(
  {
    image: { type: String, required: true },
    title: { type: String, required: true },
    skill: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "skills",
      required: true,
    },
  },
  {
    _id: false,
    timestamps: true,
  }
);

const WorkSeekerSchema = mongoose.Schema(
  {
    ...BasicInfo,
    hourlyRate: { type: Number, default: 0 },
    totalEarning: { type: String, default: 0 },
    totalAssignment: { type: String, default: 0 },
    completedAssignment: { type: Number, default: 0 },
    hardSkills: [SkillSchema],
    softSkills: [SkillSchema],
    tooling: [SkillSchema],
    certificates: [CertificatesSchema],
    experience: {
      level: {
        type: String,
        default: SKILL_LEVEL.BASIC,
        enum: [...Object.values(SKILL_LEVEL)],
      },
      positions: [
        {
          title: { type: String, required: true },
          company: { type: String, required: true },
          joinDt: { type: Date, required: true },
          finishDt: { type: Date, required: true },
        },
      ],
    },
    language: [
      {
        language: { type: String, required: true },
        read: { type: Boolean, default: false },
        write: { type: Boolean, default: false },
        verbal: { type: Boolean, default: false },
      },
    ],
    videoIntro: {
      thumbnail: { type: String, default: "" },
      video: { type: String, default: "" },
    },
    sendNotification: { type: Boolean, default: true },
    isAccountFreeze: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserSchema = mongoose.Schema(
  {
    email: { type: String, lowercase: true, trim: true, unique: true },
    workProviders: [WorkProviderSchema],
    workSeekers: [WorkSeekerSchema],
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ "workSeekers.address.loc": "2dsphere" });
const User = mongoose.model("users", UserSchema);

module.exports = User;
