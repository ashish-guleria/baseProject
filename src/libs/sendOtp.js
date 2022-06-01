const config = require("../config/config");

const otp = async (phoneNumber) => {
  // return new Promise((resolve, reject) => {
  //   var accountSid = config.twilio.sidKey; // Your Account SID from www.twilio.com/console
  //   var authToken = config.twilio.authToken; // Your Auth Token from www.twilio.com/console

  //   var OTP = Math.floor(Math.random() * 899999 + 100000);
  //   const client = require("twilio")(accountSid, authToken);
  //   client.messages
  //     .create({
  //       body: "Your Handy verification code is " + OTP,

  //       from: config.twilio.phoneNumber,
  //       to: countryCode + phoneNumber,
  //     })
  //     .then((message) => {
  //       let otpExpires = new Date();
  //       otpExpires.setSeconds(otpExpires.getSeconds() + 240);
  //       let otp = {};
  //       otp = { code: "", expiresAt: "" };
  //       otp.code = OTP;
  //       otp.expiresAt = otpExpires;
  //       resolve(otp);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       reject(err);
  //     });
  // });

  let otpExpires = new Date();
  otpExpires.setSeconds(otpExpires.getSeconds() + 240);

  let otp = {};
  otp = { code: "", expiresAt: "" };
  otp.code = 222222;
  otp.expiresAt = otpExpires;
  return otp;
};

module.exports = otp;
