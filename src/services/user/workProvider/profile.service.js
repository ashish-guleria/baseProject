const {
  STATUS_CODES,
  ERROR_MESSAGES,
  POPULATE_SKILLS,
} = require("../../../config/appConstants");
const { User } = require("../../../models");
const { OperationalError } = require("../../../utils/errors");
const { formatAddressDB } = require("../../../utils/formatResponse");

const editProfile = async (user, updateBody) => {
  // if (await User.findOne({ email: updateBody.email, _id: { $ne: user._id } })) {
  //   throw new OperationalError(
  //     STATUS_CODES.ACTION_FAILED,
  //     ERROR_MESSAGES.ACCOUNT_DELETED
  //   );
  // }
  formatAddressDB(updateBody.address);
  const updatedUser = await User.findOneAndUpdate(
    {
      _id: user._id,
    },
    {
      [`workProviders.${user.workProviders.length - 1}.profileImage`]:
        updateBody.profileImage,
      [`workProviders.${user.workProviders.length - 1}.firstName`]:
        updateBody.firstName,
      [`workProviders.${user.workProviders.length - 1}.lastName`]:
        updateBody.lastName,
      [`workProviders.${user.workProviders.length - 1}.countryCode`]:
        updateBody.countryCode,
        [`workProviders.${user.workProviders.length - 1}.phoneNumber`]:
        updateBody.phoneNumber,
      [`workProviders.${user.workProviders.length - 1}.country`]:
        updateBody.country,
      [`workProviders.${user.workProviders.length - 1}.businessName`]:
        updateBody.businessName,
      [`workProviders.${user.workProviders.length - 1}.companyNumber`]:
        updateBody.companyNumber,
      [`workProviders.${user.workProviders.length - 1}.address`]:
        updateBody.address,
      [`workProviders.${user.workProviders.length - 1}.vatNumber`]:
        updateBody.vatNumber,
    },
    {
      new: true,
      lean: true,
    }
  ).populate(POPULATE_SKILLS);

  return updatedUser;
};

module.exports = {
  editProfile,
};
