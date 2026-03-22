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
    from: `"Velora marketplace" <no-reply@naijahousing.com>`,
    to: email,
    subject,
    text: message,
  });

  console.log("📧 Email sent (fake): " + nodemailer.getTestMessageUrl(info));
};

export default sendEmail;











// FOR DEVELOPMENT PURPOSE
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// const sendEmail = async ({ to, subject, html, text }) => {
//   const { data, error } = await resend.emails.send({
//     from: `Velora Marketplace <${process.env.FROM_EMAIL}>`,
//     to,
//     subject,
//     html,
//     text,
//   });

//   if (error) {
//     throw new Error(error.message || "Failed to send email");
//   }

//   return data;
// };

// export default sendEmail;