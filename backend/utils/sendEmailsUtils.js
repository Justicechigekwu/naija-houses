
// // FOR DEVELOPMENT PURPOSE
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// const sendEmail = async ({ to, subject, text, html }) => {
//   const { data, error } = await resend.emails.send({
//     from: `Velora Marketplace <${process.env.FROM_EMAIL || "onboarding@resend.dev"}>`,
//     to,
//     subject,
//     text,
//     html,
//   });

//   if (!process.env.RESEND_API_KEY) {
//     throw new Error("RESEND_API_KEY is missing in environment variables");
//   }

//   if (error) {
//     throw new Error(error.message || "Failed to send email");
//   }

//   console.log("Sending email via Resend...");

//   return data;
// };

// export default sendEmail;



import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, text, html, replyTo }) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing in environment variables");
  }

  const payload = {
    from: `Velora Marketplace <${process.env.FROM_EMAIL || "onboarding@resend.dev"}>`,
    to,
    subject,
    text,
    html,
  };

  if (replyTo) {
    payload.replyTo = replyTo;
  }

  const { data, error } = await resend.emails.send(payload);

  if (error) {
    throw new Error(error.message || "Failed to send email");
  }

  console.log("Sending email via Resend...");

  return data;
};

export default sendEmail;