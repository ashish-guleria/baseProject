const mongoose = require("mongoose");
const AddressSchema = mongoose.Schema(
  {
    address: { type: String, required: true },
    city: { type: String },
    country: { type: String, required: true },
    postalCode: { type: String },
    loc: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
        required: true,
        // longitude, latitude
      },
    },
  },
  { timestamps: true }
);
module.exports = {
  AddressSchema,
};
