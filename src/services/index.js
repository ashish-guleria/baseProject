//user Service
module.exports.authService = require("./user/auth.service");

//workSeeker
module.exports.workSeekerProfileService = require("./user/workSeeker/profile.service");

//workProvider
module.exports.workProviderProfileService = require("./user/workProvider/profile.service");
module.exports.WPAssignmentService = require("./user/workProvider/assignment.service");

//token Service
module.exports.tokenService = require("./token.service");
module.exports.commonService = require("./user/common.service");

//admin service
module.exports.adminService = require("./admin/auth.service");
module.exports.adminWorkProviderService = require("./admin/workProvider.service");
module.exports.adminWorkSeekerService = require("./admin/workSeeker.service");
