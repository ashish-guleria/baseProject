const express = require("express");
const userAuth = require("./user/auth.routes");

const workSeekerProfile = require("./user/workSeeker/profile.routes");

const workProviderProfile = require("./user/workProvider/profile.routes");
const workProviderAssignment = require("./user/workProvider/assignment.routes");

const adminAuth = require("./admin/auth.routes");
const adminWorkProvider = require("./admin/workProvider.routes");
const adminWorkSeeker = require("./admin/workSeeker.routes");

const staticRoutes = require("./static.routes");
const commonRoutes = require("./user/common.routes");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/workseerker/profile",
    route: workSeekerProfile,
  },

  {
    path: "/workProvider/profile",
    route: workProviderProfile,
  },
  {
    path: "/workProvider/assignment",
    route: workProviderAssignment,
  },

  {
    path: "/user/auth",
    route: userAuth,
  },

  {
    path: "/admin/auth",
    route: adminAuth,
  },
  {
    path: "/admin/workProvider",
    route: adminWorkProvider,
  },

  {
    path: "/admin/workSeeker",
    route: adminWorkSeeker,
  },

  {
    path: "/",
    route: staticRoutes,
  },
  {
    path: "/user",
    route: commonRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
