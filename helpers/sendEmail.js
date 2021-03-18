const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    // secure: false,
    // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL, // generated ethereal user
      pass: process.env.SMTP_PASSWORD // generated ethereal password
    }
  });

  // send mail with defined transport object
  // let info = await transporter.sendMail(
  let message = {
    from: process.env.FROM_NAME,
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };

  const info = await transporter.sendMail(message);
};

module.exports = sendEmail;
