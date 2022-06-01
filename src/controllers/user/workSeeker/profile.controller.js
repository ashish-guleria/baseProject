const { workSeekerProfileService } = require("../../../services");
const {
  catchAsync,
} = require("../../../utils/universalFunction");
const {
  formatUser,
  formatAddressDB,
} = require("../../../utils/formatResponse");
const { successResponse } = require("../../../utils/response");
const {
  SUCCESS_MESSAGES,
  STATUS_CODES,
} = require("../../../config/appConstants");

const editBasicInfo = catchAsync(async (req, res) => {
  const user = await workSeekerProfileService.editBasicInfo(
    req.token.user,
    req.body
  );
  formatUser(user, req.token.role);
  formatAddressDB;
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    user
  );
});

const editSkills = catchAsync(async (req, res) => {
  const user = await workSeekerProfileService.editSkills(
    req.token.user,
    req.body
  );
  formatUser(user, req.token.role);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    user
  );
});

const editCertificates = catchAsync(async (req, res) => {
  const user = await workSeekerProfileService.editCertificates(
    req.token.user,
    req.body
  );
  formatUser(user, req.token.role);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    {user}
  );
});

const editExperience = catchAsync(async (req, res) => {
  const user = await workSeekerProfileService.editExperience(
    req.token.user,
    req.body
  );
  formatUser(user, req.token.role);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    {user}
  );
});

const editVideoIntro = catchAsync(async (req, res) => {
  const user = await workSeekerProfileService.editVideoIntro(
    req.token.user,
    req.body
  );
  formatUser(user, req.token.role);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    {user}
  );
});

const language = catchAsync(async (req, res) => {
  const user = await workSeekerProfileService.editLanguage(
    req.token.user,
    req.body
  );
  formatUser(user, req.token.role);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    {user}
  );
});

module.exports = {
  editBasicInfo,
  editSkills,
  editCertificates,
  editExperience,
  editVideoIntro,
  language,
};
