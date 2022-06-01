const Joi = require("joi");
const { objectId } = require("../validations/custom.validation");

const TOKEN_TYPE = {
  ACCESS: "access",
  REFRESH: "refresh",
  RESET_PASSWORD: "resetPassword",
};

const USER_TYPE = {
  ADMIN: "admin",
  WORK_PROVIDER: "workProvider",
  WORK_SEEKER: "workSeeker",
};

const DEVICE_TYPE = {
  IPHONE: "iPhone",
  ANDROID: "android",
  WEB: "web",
};

const STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
};

const JOI = {
  EMAIL: Joi.string().email().lowercase().trim().required(),
  PASSWORD: Joi.string().min(6).required(),
  PHONENUMBER: Joi.string()
    .max(10)
    .min(10)
    .message("Please enter a valid phone number"),
  LIMIT: Joi.number().default(10),
  PAGE: Joi.number().default(0),
  OBJECTID: Joi.string().custom(objectId).required(),
  DEVICE_TYPE: Joi.string()
    .valid(...Object.values(DEVICE_TYPE))
    .required(),
  USER_TYPE: Joi.string()
    .valid(USER_TYPE.WORK_PROVIDER, USER_TYPE.WORK_SEEKER)
    .required(),
};

const SKILL_LEVEL = {
  BASIC: 0,
  ASTUTE: 1,
  EXPERT: 2,
};

const WORK_LOCATION = {
  REMOTE: "remote",
  WORk_LOCATION: "work",
};

const ASSIGNMENT_STATUS = {
  DRAFT: "draft",
  PROPOSED: "proposed",
  IN_PROCESS: "inProcess",
  COMPLETED: "completed",
};

const REQUEST_STATUS = {
  RECEIVED: "received",
  PROPOSED: "proposed",
  REJECDED: "rejected",
};

const SUCCESS_MESSAGES = {
  SUCCESS: "Success",
  LOGOUT: "User successfully logged out",
};

const ERROR_MESSAGES = {
  NOT_FOUND: "Not found",
  VALIDATION_FAILED: "Validation Failed, Kindly check your parameters",
  SERVER_ERROR: "Something went wrong, Please try again.",
  AUTHENTICATION_FAILED: "Please authenticate",
  UNAUTHORIZED: "You are not authorized to perform this action",
  EMAIL_ALREADY_EXIST: "This email already exist. Please try with other email",
  EMAIL_NOT_FOUND: "Email not found",
  ACCOUNT_NOT_EXIST: "Account does not exist",
  WRONG_PASSWORD: "Password is Incorrect",
  ACCOUNT_DELETED: "Your account has been deleted by Admin",
  ACCOUNT_BLOCKED: "Your account has been blocked by Admin",
  USER_NOT_FOUND: "User not found",
  SKILL_ALREADY_EXIST: "Skill already exist with this name.",
  WRONG_PASSWORD: "Password is Incorrect",
};

const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  ACTION_PENDING: 202,
  ACTION_COMPLETE: 204,

  VALIDATION_FAILED: 400,
  ACTION_FAILED: 400,
  AUTH_FAILED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,

  ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

const POPULATE_SKILLS = [
  `workSeekers.hardSkills.skill`,
  `workSeekers.softSkills.skill`,
  `workSeekers.tooling.skill`,
  `workSeekers.certificates.skill`,
];

module.exports = {
  TOKEN_TYPE,
  USER_TYPE,
  STATUS,
  JOI,
  DEVICE_TYPE,
  SKILL_LEVEL,
  WORK_LOCATION,
  ASSIGNMENT_STATUS,
  REQUEST_STATUS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  STATUS_CODES,
  POPULATE_SKILLS,
};
