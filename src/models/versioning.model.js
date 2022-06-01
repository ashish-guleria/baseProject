const mongoose = require("mongoose");

const VersioningSchema = mongoose.Schema({
  appVersioning: {
    ios: {
      force: { type: String, required: true },
      optional: { type: String, required: true },
      
    },
    android: {
      force: { type: String, required: true },
      optional: { type: String, required: true },
    },
  },
});

const Versioning = mongoose.model("versioning", VersioningSchema);

module.exports = Versioning;
