const { commonService } = require("../../services");
const {
  USER_TYPE,
  STATUS_CODES,
  SUCCESS_MESSAGES,
} = require("../../config/appConstants");
const { catchAsync } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");

const changePassword = catchAsync(async (req, res) => {
  await commonService.changePassword(
    req.token,
    req.body.oldPassword,
    req.body.newPassword
  );

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS
  );
});

const toggleNotification = catchAsync(async (req, res) => {
  const user = await commonService.toggleNotification(req.token);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    { user }
  );
});

const getProfile = catchAsync(async (req, res) => {
  let user = req.token.user;
  if (req.token.role === USER_TYPE.WORK_PROVIDER) {
    delete user.workProvider.password;
    delete user.workProvider.isBlocked;
    delete user.workProvider.isDeleted;
  }
  if (req.token.role === USER_TYPE.WORK_SEEKER) {
    delete user.workSeeker.password;
    delete user.workSeeker.isBlocked;
    delete user.workSeeker.isDeleted;
  }

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    { user }
  );
});

const addSkill = catchAsync(async (req, res) => {
  await commonService.addSkill(req.body.name);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS
  );
});

const getSkills = catchAsync(async (req, res) => {
  const skills = await commonService.getSkills();
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    skills
  );
});

const freezeAccount = catchAsync(async (req, res) => {
  const user = await commonService.freezeAccount(req.token);

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    { user }
  );
});

const addCard = catchAsync(async (req, res) => {
  await commonService.addCard(req.token, req.body.cardToken);
  return successResponse(req, res);
});
const deleteCard = catchAsync(async (req, res) => {
  await commonService.deleteCard(req.token, req.query.cardId);
  return successResponse(req, res);
});

const getCards = catchAsync(async (req, res) => {
  const cards = await commonService.getCards(req.token, req.query.cardId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    { cards }
  );
});

const makeDefaultCard = catchAsync(async (req, res) => {
  await commonService.makeDefaultCard(req.token, req.body.cardId);
  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS
  );
});

module.exports = {
  changePassword,
  toggleNotification,
  freezeAccount,
  getProfile,
  addSkill,
  getSkills,
  addCard,
  deleteCard,
  getCards,
  makeDefaultCard,
};
