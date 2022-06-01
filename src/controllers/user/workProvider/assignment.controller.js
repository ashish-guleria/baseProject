const {
  workProviderProfileService,
  WPAssignmentService,
} = require("../../../services");
const { catchAsync } = require("../../../utils/universalFunction");
const { successResponse } = require("../../../utils/response");
const {
  STATUS_CODES,
  SUCCESS_MESSAGES,
} = require("../../../config/appConstants");
const formatRes = require("../../../utils/formatResponse");

const getWorkSeekers = catchAsync(async (req, res) => {
  const users = await WPAssignmentService.getWorkSeekers(req.body);
  users.map((user) => {
    formatRes.matchSkills(
      {
        hardSkills: req.body.hardSkills,
        softSkills: req.body.softSkills,
        tooling: req.body.tooling,
      },
      user
    );
  });

  return successResponse(
    req,
    res,
    STATUS_CODES.SUCCESS,
    SUCCESS_MESSAGES.SUCCESS,
    { users }
  );
});

module.exports = {
  getWorkSeekers,
};
