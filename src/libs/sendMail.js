const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const config = require("../config/config");

var resetPassword = fs.readFileSync(
  path.join(__dirname, "../../views/email/resetPassword.hbs"),
  "utf8"
);
var resetPasswordTemplate = Handlebars.compile(resetPassword);

var verify = fs.readFileSync(
  path.join(__dirname, "../../views/email/verifyAccount.hbs"),
  "utf8"
);
var verifyAccountTemplate = Handlebars.compile(verify);

try {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.smtp.email,
      pass: config.smtp.password,
    },
  });

  function forgotPasswordEmail(email, token, userName) {
    return new Promise((resolve, reject) => {
      var info = {
        from: config.smtp.email,
        to: email,
        subject: "Reset Password",
        attachments: [
          {
            filename: "logo.png",
            path: __dirname + "/images/logo.png",
            cid: "logo",
          },
        ],
        html: resetPasswordTemplate({
          token,
          apiBaseUrl: config.baseurl,
          title: "Forgot Password",
          userName,
        }),
      };

      transporter.sendMail(info, (error, accept) => {
        if (error) {
          reject(error);
        }
        resolve(accept, console.log("Mail Sended"));
      });
    });
  }

  function verifyAccount(email, token) {
    return new Promise((resolve, reject) => {
      var info = {
        from: config.smtp.email,
        to: email,
        subject: "Verify Account",
        html: verifyAccountTemplate({
          title: "Verification",
          token,
          apiBaseUrl: config.baseurl,
        }),
      };

      transporter.sendMail(info, (error, accept) => {
        if (error) {
          reject(error);
        }
        resolve(accept, console.log("Mail Sended"));
      });
    });
  }
} catch (err) {
  throw err;
}

module.exports = { forgotPasswordEmail, verifyAccount };
