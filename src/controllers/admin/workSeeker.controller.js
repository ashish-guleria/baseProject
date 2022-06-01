const {
  workSeekerProfileService,
  adminWorkSeekerService,
} = require("../../services");
const { catchAsync, successMessage } = require("../../utils/universalFunction");
const { successResponse } = require("../../utils/response");
const {
  SUCCESS_MESSAGES,
  STATUS_CODES,
  USER_TYPE,
} = require("../../config/appConstants");
const { formatUser, formatUserDB } = require("../../utils/formatResponse");

const getWorkSeekers = catchAsync(async (req, res) => {
  const data = await adminWorkSeekerService.getWorkSeekers(
    req.query.page,
    req.query.limit,
    req.query.search
  );
  data.users.map((user) => {
    formatUser(user, USER_TYPE.WORK_SEEKER);
  });

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.DEFAULT,
    data
  );
});

const block = catchAsync(async (req, res) => {
  const user = await workSeekerProfileService.getUserById(req.body.userId);

  formatUserDB(user, USER_TYPE.WORK_SEEKER);

  let isBlocked;
  user.workSeekers[user.workSeekers.length - 1].isBlocked
    ? (isBlocked = false)
    : (isBlocked = true);

  await adminWorkSeekerService.ChangeStatus(user, isBlocked);

  return successResponse(req, res);
});

const deleteWorkSeeker = catchAsync(async (req, res) => {
  await adminWorkSeekerService.deleteWorkSeeker(req.query.userId);
  return successResponse(req, res);
});

module.exports = {
  getWorkSeekers,
  block,
  deleteWorkSeeker,
};
