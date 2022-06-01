const bcrypt = require("bcryptjs");

const { User, Skill } = require("../../models");
const { OperationalError } = require("../../utils/errors");
const {
  STATUS_CODES,
  ERROR_MESSAGES,
  USER_TYPE,
  POPULATE_SKILLS,
} = require("../../config/appConstants");
const { formatUser } = require("../../utils/formatResponse");
const config = require("../../config/config");
const stripe = require("stripe")(config.stripe.secretKey);

const changePassword = async (tokenData, oldPassword, newPassword) => {
  const userPassword =
    tokenData.role === USER_TYPE.WORK_PROVIDER
      ? tokenData.user.workProvider.password
      : tokenData.user.workSeeker.password;

  if (!(await bcrypt.compare(oldPassword, userPassword))) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.WRONG_PASSWORD
    );
  }
  let query = { _id: tokenData.user };
  let updateBody = {};
  newPassword = await bcrypt.hash(newPassword, 8);
  if (tokenData.role === USER_TYPE.WORK_PROVIDER) {
    query = {
      ...query,
      workProviders: {
        $elemMatch: { _id: tokenData.workProvider },
      },
    };
    updateBody = {
      ...updateBody,
      "workProviders.$.password": newPassword,
    };
  }
  if (tokenData.role === USER_TYPE.WORK_SEEKER) {
    query = {
      ...query,
      workSeekers: {
        $elemMatch: { _id: tokenData.workSeeker },
      },
    };
    updateBody = {
      ...updateBody,
      "workSeekers.$.password": newPassword,
    };
  }

  const updatedUser = await User.findOneAndUpdate(query, updateBody);
  // let updatedPassword = { password: newPassword };
  // Object.assign(user, updatedPassword);
  // await user.save();
  return updatedUser;
};

const toggleNotification = async (tokenData) => {
  let updateBody = {};

  if (tokenData.role === USER_TYPE.WORK_SEEKER) {
    if (
      tokenData.user.workSeekers[tokenData.user.workSeekers.length - 1]
        .sendNotification
    ) {
      updateBody = {
        [`workSeekers.${
          tokenData.user.workSeekers.length - 1
        }.sendNotification`]: false,
      };
    } else {
      updateBody = {
        [`workSeekers.${
          tokenData.user.workSeekers.length - 1
        }.sendNotification`]: true,
      };
    }
  }

  if (tokenData.role === USER_TYPE.WORK_PROVIDER) {
    if (
      tokenData.user.workProviders[tokenData.user.workProviders.length - 1]
        .sendNotification
    ) {
      updateBody = {
        [`workProviders.${
          tokenData.user.workProviders.length - 1
        }.sendNotification`]: false,
      };
    } else {
      updateBody = {
        [`workProviders.${
          tokenData.user.workProviders.length - 1
        }.sendNotification`]: true,
      };
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    tokenData.user._id,
    updateBody,
    {
      new: true,
      lena: true,
    }
  )
    .populate(POPULATE_SKILLS)
    .lean();
  formatUser(updatedUser, tokenData.role);
  return updatedUser;
};

const freezeAccount = async (tokenData) => {
  let updateBody = {};

  if (tokenData.role === USER_TYPE.WORK_SEEKER) {
    updateBody = {
      [`workSeekers.${
        tokenData.user.workSeekers.length - 1
      }.isAccountFreeze`]: true,
    };
  }

  if (tokenData.role === USER_TYPE.WORK_PROVIDER) {
    updateBody = {
      [`workProviders.${
        tokenData.user.workProviders.length - 1
      }.isAccountFreeze`]: true,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(
    tokenData.user._id,
    updateBody,
    {
      new: true,
      lena: true,
    }
  )
    .populate(POPULATE_SKILLS)
    .lean();
  formatUser(updatedUser, tokenData.role);
  return updatedUser;
};

const addSkill = async (name) => {
  if (
    await Skill.findOne({
      enName: { $regex: RegExp(name, "i") },
    })
  ) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.SKILL_ALREADY_EXIST
    );
  }
  await Skill.create({ enName: name });
};

const getSkills = async () => {
  return Skill.find({});
};

const addCard = async (tokenData, cardToken) => {
  let customerId;
  if (tokenData.role == USER_TYPE.WORK_PROVIDER) {
    customerId = tokenData.user.workProvider.stripe.customerId;
  }
  if (tokenData.role == USER_TYPE.WORK_SEEKER) {
    customerId = tokenData.user.workSeeker.stripe.customerId;
  }

  const card = await stripe.customers.createSource(customerId, {
    source: cardToken,
  });

  let updateBody = {};
  if (
    tokenData.role == USER_TYPE.WORK_PROVIDER &&
    !tokenData.user.workProvider.stripe.defaultCard
  ) {
    updateBody = {
      [`workProviders.${
        tokenData.user.workProviders.length - 1
      }.stripe.defaultCard`]: card.id,
    };
  }
  if (
    tokenData.role == USER_TYPE.WORK_SEEKER &&
    !tokenData.user.workSeeker.stripe.defaultCard
  ) {
    updateBody = {
      [`workSeekers.${
        tokenData.user.workSeekers.length - 1
      }.stripe.defaultCard`]: card.id,
    };
  }
  await User.findByIdAndUpdate(tokenData.user._id, updateBody);
};

const deleteCard = async (tokenData, cardId) => {
  let customerId;
  if (tokenData.role == USER_TYPE.WORK_PROVIDER) {
    customerId = tokenData.user.workProvider.stripe.customerId;
  }
  if (tokenData.role == USER_TYPE.WORK_SEEKER) {
    customerId = tokenData.user.workSeeker.stripe.customerId;
  }

  await stripe.customers.deleteSource(customerId, cardId);
};

const getCards = async (tokenData) => {

  let customerId;
  let defaultCard;
  if (tokenData.role == USER_TYPE.WORK_PROVIDER) {
    customerId = tokenData.user.workProvider.stripe.customerId;
    defaultCard = tokenData.user.workProvider.stripe.defaultCard;
  }
  if (tokenData.role == USER_TYPE.WORK_SEEKER) {
    customerId = tokenData.user.workSeeker.stripe.customerId;
    defaultCard = tokenData.user.workSeeker.stripe.defaultCard;
  }

  const cards = await stripe.customers.listSources(customerId, {
    object: "card",
  });
  cards.defaultCard = defaultCard;
  return cards;
};

const makeDefaultCard = async (tokenData, cardId) => {
 
  if (tokenData.role == USER_TYPE.WORK_PROVIDER) {
    updateBody = {
      [`workProviders.${
        tokenData.user.workProviders.length - 1
      }.stripe.defaultCard`]: cardId,
    };
  }
  if (tokenData.role == USER_TYPE.WORK_SEEKER) {
    updateBody = {
      [`workSeekers.${
        tokenData.user.workSeekers.length - 1
      }.stripe.defaultCard`]: cardId,
    };
  }
  await User.findByIdAndUpdate(tokenData.user._id, updateBody);
};

module.exports = {
  changePassword,
  toggleNotification,
  addSkill,
  getSkills,
  freezeAccount,
  addCard,
  deleteCard,
  getCards,
  makeDefaultCard,
};

