const {
  STATUS_CODES,
  ERROR_MESSAGES,
  POPULATE_SKILLS,
} = require("../../../config/appConstants");
const { User } = require("../../../models");
const { OperationalError } = require("../../../utils/errors");
const {
  formatAddressDB,
  converStringToDate,
} = require("../../../utils/formatResponse");
const { ApiError } = require("../../../utils/universalFunction");

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email }).lean();
  if (!user) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.EMAIL_NOT_FOUND
    );
  }
  return user;
};

const getUserById = async (userId) => {
  const user = await User.findOne({
    _id: userId,
  }).lean();
  if (!user) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
  return user;
};

const editBasicInfo = async (user, updateBody) => {
  // if (await User.findOne({ email: updateBody.email, _id: { $ne: user._id } })) {
  //   throw new OperationalError(
  //     STATUS_CODES.ACTION_FAILED,
  //     ERROR_MESSAGES.ACCOUNT_DELETED
  //   );
  // }
  formatAddressDB(updateBody.address);

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      [`workSeekers.${user.workSeekers.length - 1}.profileImage`]:
        updateBody.profileImage,
      [`workSeekers.${user.workSeekers.length - 1}.hourlyRate`]:
        updateBody.hourlyRate,
      [`workSeekers.${user.workSeekers.length - 1}.firstName`]:
        updateBody.firstName,
      [`workSeekers.${user.workSeekers.length - 1}.lastName`]:
        updateBody.lastName,
      [`workSeekers.${user.workSeekers.length - 1}.countryCode`]:
        updateBody.countryCode,
      [`workSeekers.${user.workSeekers.length - 1}.phoneNumber`]:
        updateBody.phoneNumber,
      [`workSeekers.${user.workSeekers.length - 1}.country`]:
        updateBody.country,
      [`workSeekers.${user.workSeekers.length - 1}.businessName`]:
        updateBody.businessName,
      [`workSeekers.${user.workSeekers.length - 1}.companyNumber`]:
        updateBody.companyNumber,
      [`workSeekers.${user.workSeekers.length - 1}.address`]:
        updateBody.address,
      [`workSeekers.${user.workSeekers.length - 1}.vatNumber`]:
        updateBody.vatNumber,
    },
    {
      new: true,
      lean: true,
    }
  ).populate(POPULATE_SKILLS);
  return updatedUser;
};

const findOneAndUpdate = async (user, updateBody) => {
  const result = User.findOneAndUpdate({ _id }, updateBody, { new: true });
  return result;
};

const editSkills = async (user, updateBody) => {
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      [`workSeekers.${user.workSeekers.length - 1}.hardSkills`]:
        updateBody.hardSkills,
      [`workSeekers.${user.workSeekers.length - 1}.softSkills`]:
        updateBody.softSkills,
      [`workSeekers.${user.workSeekers.length - 1}.tooling`]:
        updateBody.tooling,
    },
    {
      new: true,
      lean: true,
    }
  ).populate(POPULATE_SKILLS)

  return updatedUser;
};

const editCertificates = async (user, updateBody) => {
  const updateUser = await User.findByIdAndUpdate(
    user._id,
    {
      [`workSeekers.${user.workSeekers.length - 1}.certificates`]: updateBody,
    },
    {
      new: true,
      lean: true,
    }
  ).populate(POPULATE_SKILLS)
  return updateUser;
};

const editExperience = async (user, updateBody) => {
  updateBody.positions.map((position) => {
    position.joinDt = converStringToDate(position.joinDt);
    position.finishDt = converStringToDate(position.finishDt);
  });

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { [`workSeekers.${user.workSeekers.length - 1}.experience`]: updateBody },
    {
      new: true,
      lean: true,
    }
  ).populate(POPULATE_SKILLS)

  return updatedUser;
};

const editVideoIntro = async (user, updateBody) => {
  // const dataToBeUpdate = {
  //   videoIntro: updateBody,
  // };

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { [`workSeekers.${user.workSeekers.length - 1}.videoIntro`]: updateBody },
    {
      new: true,
      lean: true,
    }
  ).populate(POPULATE_SKILLS)
  return updatedUser;
};

const editLanguage = async (user, updateBody) => {
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { [`workSeekers.${user.workSeekers.length - 1}.language`]: updateBody },
    {
      new: true,
      lean: true,
    }
  ).populate(POPULATE_SKILLS)
  return updatedUser;
};

module.exports = {
  getUserById,
  editBasicInfo,
  getUserByEmail,
  findOneAndUpdate,
  editSkills,
  editCertificates,
  editExperience,
  editVideoIntro,
  editLanguage,
};
