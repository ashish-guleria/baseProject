const mongoose = require("mongoose");

const {
  STATUS_CODES,
  ERROR_MESSAGES,
  POPULATE_SKILLS,
  USER_TYPE,
} = require("../../../config/appConstants");
const { User } = require("../../../models");
const { OperationalError } = require("../../../utils/errors");
const { formatUser } = require("../../../utils/formatResponse");

const getWorkSeekers = async (data) => {
  const skills = ["hardSkills", "softSkills", "tooling"];
  let hardSkills = { $or: [] };
  let softSkills = { $or: [] };
  let tooling = { $or: [] };

  data.hardSkills.map((skill) => {
    hardSkills.$or.push({
      $and: [
        {
          "workSeekers.hardSkills.skill": new mongoose.Types.ObjectId(
            skill.skill
          ),
        },
        { "workSeekers.hardSkills.level": skill.level },
      ],
    });
  });

  data.softSkills.map((skill) => {
    softSkills.$or.push({
      $and: [
        {
          "workSeekers.softSkills.skill": new mongoose.Types.ObjectId(
            skill.skill
          ),
        },
        { "workSeekers.softSkills.level": skill.level },
      ],
    });
  });

  data.tooling.map((skill) => {
    tooling.$or.push({
      $and: [
        {
          "workSeekers.tooling.skill": new mongoose.Types.ObjectId(skill.skill),
        },
        { "workSeekers.tooling.level": skill.level },
      ],
    });
  });

  let query = {
    // $and: [{ "workSeekers.isDeleted": false }, hardSkills, softSkills, tooling],

    "workSeekers.address.loc": {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [data.longitude, data.latitude],
        },
        $maxDistance: 500,
      },
    },
  };
  console.log(query, data);
  const users = await User.find(
    query
    //    {
    //   workSeekers: { $slice: -1 },
    // }
  )
    .lean()
    .populate(POPULATE_SKILLS);
  // const users = await User.aggregate([
  //   { $unwind: "$workSeekers" },
  //   { $match: { "workSeekers.isDeleted": false } },
  //   { $match: query },
  //   { $sort: { _id: -1 } },
  //   { $limit: data.limit },
  //   { $skip: data.page * data.limit },
  // ]);
  users.map((user) => {
    formatUser(user, USER_TYPE.WORK_SEEKER);
  });
  return users;

  //   console.log(query);
  //   return query;
};

module.exports = {
  getWorkSeekers,
};
