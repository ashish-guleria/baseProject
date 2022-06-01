const {
  adminWorkProviderService,
  workSeekerProfileService,
  workProviderProfileService,
} = require("../../services");
const { catchAsync } = require("../../utils/universalFunction");
const {
  formatWorkSeeker,
  formatUser,
  formatUserDB,
} = require("../../utils/formatResponse");
const { successResponse } = require("../../utils/response");
const {
  SUCCESS_MESSAGES,
  STATUS_CODES,
  USER_TYPE,
} = require("../../config/appConstants");

const getUsers = catchAsync(async (req, res) => {
  const data = await adminWorkProviderService.getUsers(
    req.query.page,
    req.query.limit,
    req.query.search
  );

  data.users.map((user) => {
    formatUser(user, USER_TYPE.WORK_PROVIDER);
  });

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    data
  );
});

const getUser = catchAsync(async (req, res) => {
  const userdata = await workProviderProfileService.getUserById(
    req.query.userId
  );
  let formatedUser = formatWorkSeeker(
    userdata.toObject(),
    req.headers.timezone
  );
  return successResponse(
    req,
    res,
    SUCCESS_MESSAGES.SUCCESS,
    STATUS_CODES.SUCCESS,
    { user: formatedUser }
  );
});

const block = catchAsync(async (req, res) => {
  const user = await workSeekerProfileService.getUserById(req.body.userId);

  formatUserDB(user, USER_TYPE.WORK_PROVIDER);

  let isBlocked;
  user.workProviders[user.workProviders.length - 1].isBlocked
    ? (isBlocked = false)
    : (isBlocked = true);

  await adminWorkProviderService.ChangeStatus(user, isBlocked);

  return successResponse(req, res);
});

const deleteWorkProvider = catchAsync(async (req, res) => {
  const user = await adminWorkProviderService.deleteWorkProvider(
    req.query.userId
  );
  return successResponse(req, res);
});

module.exports = {
  getUsers,
  getUser,
  block,
  deleteWorkProvider,
};
