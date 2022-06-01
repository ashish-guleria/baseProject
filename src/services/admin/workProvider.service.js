const { User, Token } = require("../../models");
const {
  ApiError,
  paginationOptions,
} = require("../../utils/universalFunction");
const { USER_TYPE } = require("../../config/appConstants");
const { workProviderProfileService } = require("..");

const getUsers = async (page, limit, search) => {
  var query = { workProviders: { $elemMatch: { isDeleted: false } } };
  if (search) {
    query = {
      ...query,
      $or: [
        {
          workProviders: {
            $elemMatch: { firstName: { $regex: RegExp(search, "i") } },
          },
        },
        {
          workProviders: {
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

const deleteWorkProvider = async (userId) => {
  await User.findOneAndUpdate(
    { workProviders: { $elemMatch: { isDeleted: false } } },
    {
      "workProviders.$.isDeleted": true,
    }
  );
};

const ChangeStatus = async (user, status) => {
  const updatedUser = await User.findByIdAndUpdate(user._id, {
    [`workProviders.${user.workProviders.length - 1}.isBlocked`]: status,
  });
  Token.updateMany(
    {
      workProviders:
        updatedUser.workProviders[updatedUser.workProviders.length - 1]._id,
    },
    { isDeleted: true }
  );
  return updatedUser;
};

module.exports = {
  getUsers,
  deleteWorkProvider,
  ChangeStatus,
};
