const { workProviderProfileService } = require("../../../services");
const {
  catchAsync,
} = require("../../../utils/universalFunction");
const {
  formatUser,
} = require("../../../utils/formatResponse");
const { successResponse } = require("../../../utils/response");
const {
  STATUS_CODES,
  SUCCESS_MESSAGES,
} = require("../../../config/appConstants");

const editProfile = catchAsync(async (req, res) => {
  const user = await workProviderProfileService.editProfile(
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
  editProfile,
};
