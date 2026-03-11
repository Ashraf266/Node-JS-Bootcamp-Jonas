const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // create a transporter
  // ---------------- gmail ---------------
  //   const transporter = nodemailer.createTransport({
  //     service: 'Gmail',
  //     auth: {
  //       user: process.env.EMAIL_USERNAME,
  //       pass: process.env.EMAIL_PASSWORD,
  //     },
  //   });
  // activate less secure app option on gmail
  // --------------------------------------

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    connectionTimeout: 5000,
  });

  // define the email options

  const mailOptions = {
    from: 'Mohamed Ashraf <test@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html
  };

  // send the email with nodemailer
  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
