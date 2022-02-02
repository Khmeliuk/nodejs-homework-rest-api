const nodemailer = require("nodemailer");
require("dotenv").config();

require("dotenv").config();
//  2525 alternative port
const config = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

module.exports = transporter;
