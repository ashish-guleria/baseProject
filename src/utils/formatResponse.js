const momentTz = require("moment-timezone");
const moment = require("moment");
const { USER_TYPE } = require("../config/appConstants");

const localtime = (DateTime, timeZone) => {
  const localDt = momentTz.tz(DateTime, timeZone).format("YYYY-MM-DDTHH:mm:ss");
  return localDt;
};

const utcTime = (DateTime, timeZone) => {
  const utctime =
    momentTz.tz(DateTime, timeZone).utc().format("YYYY-MM-DDTHH:mm:ss") + "Z";
  return new Date(utctime);
};

const converStringToDate = (date) => {
  return moment(date + "Z", "DD-MM-YYYY" + "Z").toDate();
};

const formatAddressDB = (address) => {
  address.loc = { coordinates: [address.longitude, address.latitude] };
  delete address.longitude;
  delete address.latitude;
};

const formatWorkSeeker = (userData, timezone) => {
  delete userData.__v;
  delete userData.password;
  delete userData.isBlockedAsWorkProvider;
  delete userData.isBlockedAsWorkSeeker;
  delete userData.isWorkSeeker;
  delete userData.isWorkProvider;
  delete userData.workProvider;
  userData.createdAt = localtime(userData.createdAt, timezone);
  userData.updatedAt = localtime(userData.updatedAt, timezone);
  return userData;
};

const formatWorkProvider = (userData, timezone) => {
  delete userData.__v;
  delete userData.password;
  delete userData.isBlockedAsWorkProvider;
  delete userData.isBlockedAsWorkSeeker;
  delete userData.isWorkSeeker;
  delete userData.isWorkProvider;
  delete userData.workSeeker;
  userData.createdAt = localtime(userData.createdAt, timezone);
  userData.updatedAt = localtime(userData.updatedAt, timezone);

  return userData;
};

const formatUser = (userData, formatAs) => {
  delete userData.__v;
  if (USER_TYPE.WORK_PROVIDER == formatAs) {
    userData.workProvider =
      userData.workProviders[userData.workProviders.length - 1];
    delete userData.workSeekers;
    delete userData.workProvider.password;
    delete userData.workProviders;
  }
  if (USER_TYPE.WORK_SEEKER == formatAs) {
    userData.workSeeker = userData.workSeekers[userData.workSeekers.length - 1];
    delete userData.workProviders;
    delete userData.workSeeker.password;
    delete userData.workSeekers;
  }
};

const formatUserDB = (userData, formatAs) => {
  delete userData.__v;
  if (USER_TYPE.WORK_PROVIDER == formatAs) {
    delete userData.workSeekers;
    userData.workProvider =
      userData.workProviders[userData.workProviders.length - 1];

    // delete userData.workProviders;
  }
  if (USER_TYPE.WORK_SEEKER == formatAs) {
    delete userData.workProviders;
    userData.workSeeker = userData.workSeekers[userData.workSeekers.length - 1];
    // delete userData.workSeekers;
  }
};

const matchSkills = (skills, user) => {
  //console.log(user, skills);

  skills.hardSkills.map((skill) => {
    let flag = 1;
    user.workSeeker.hardSkills.map((userSkill) => {
      if (skill.skill.toString() === userSkill.skill._id.toString()) {
        skill.level === userSkill.level
          ? (userSkill.isMatch = true)
          : (userSkill.isMatch = false);
        flag = 0;
        userSkill.requiredLevel = skill.level;
      }
    });
    if (flag) {
      user.workSeeker.hardSkills.push({
        skill: skill.skill,
        enName: "test skill",
        requiredLevel: skill.level,
      });
    }
  });
  skills.softSkills.map((skill) => {
    let flag = 1;
    user.workSeeker.softSkills.map((userSkill) => {
      if (skill.skill.toString() === userSkill.skill._id.toString()) {
        skill.level === userSkill.level
          ? (userSkill.isMatch = true)
          : (userSkill.isMatch = false);
        flag = 0;
        userSkill.requiredLevel = skill.level;
      }
    });
    if (flag) {
      user.workSeeker.softSkills.push({
        skill: skill.skill,
        enName: "test skill",
        requiredLevel: skill.level,
      });
    }
  });
  skills.tooling.map((skill) => {
    let flag = 1;
    user.workSeeker.tooling.map((userSkill) => {
      if (skill.skill.toString() === userSkill.skill._id.toString()) {
        skill.level === userSkill.level
          ? (userSkill.isMatch = true)
          : (userSkill.isMatch = false);
        flag = 0;
        userSkill.requiredLevel = skill.level;
      }
    });
    if (flag) {
      user.workSeeker.tooling.push({
        skill: skill.skill,
        enName: "test skill",
        requiredLevel: skill.level,
      });
    }
  });
};

//format address

module.exports = {
  formatWorkSeeker,
  converStringToDate,
  formatAddressDB,
  formatWorkProvider,
  formatUser,
  formatUserDB,
  matchSkills,
};
