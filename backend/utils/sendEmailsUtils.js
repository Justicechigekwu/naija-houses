// import nodemailer from 'nodemailer';

// const sendEmail = async ({ email, subject, message }) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: `"Your App" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject,
//     text: message,
//   });
// };

// export default sendEmail;





import nodemailer from "nodemailer";

const sendEmail = async ({ email, subject, message }) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  let info = await transporter.sendMail({
    from: `"Naija Housing" <no-reply@naijahousing.com>`,
    to: email,
    subject,
    text: message,
  });

  console.log("📧 Email sent (fake): " + nodemailer.getTestMessageUrl(info));
};

export default sendEmail;


