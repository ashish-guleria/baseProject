const { workSeekerProfileService, tokenService } = require("..");
const { User, Token } = require("../../models");
const {
  ApiError,
  paginationOptions,
} = require("../../utils/universalFunction");

const getWorkSeekers = async (page, limit, search) => {
  var query = { workSeekers: { $elemMatch: { isDeleted: false } } };
  if (search) {
    query = {
      ...query,
      $or: [
        {
          workSeekers: {
            $elemMatch: { firstName: { $regex: RegExp(search, "i") } },
          },
        },
        {
          workSeekers: {
            $elemMatch: { lastName: { $regex: RegExp(search, "i") } },
          },
        },
      ],
    };
  }

  const [users, count] = await Promise.all([
    User.find(query, {}, paginationOptions(page, limit)),
    User.countDocuments(query),
  ]);

  return { users, count };
};

const deleteWorkSeeker = async (userId) => {
  await User.findOneAndUpdate(
    { workSeekers: { $elemMatch: { isDeleted: false } } },
    {
      "workSeekers.$.isDeleted": true,
    }
  );
};

const ChangeStatus = async (user, status) => {
  const updatedUser = await User.findByIdAndUpdate(user._id, {
    [`workSeekers.${user.workSeekers.length - 1}.isBlocked`]: status,
  });
  Token.updateMany(
    {
      workSeeker:
        updatedUser.workSeekers[updatedUser.workSeekers.length - 1]._id,
    },
    { isDeleted: true }
  );
  return updatedUser;
};

module.exports = {
  getWorkSeekers,
  deleteWorkSeeker,
  ChangeStatus,
};
