import nodemailer from "nodemailer";

const transpoter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GOOGLE_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESEH_TOKEN,
  },
});

transpoter
  .verify()
  .then(() => {
    console.log("Email Transporter Ready to send email");
  })
  .catch((err) => {
    console.log("Error in setting up transporter", err);
  });

const sendEmail = async ({to, subject, html, text}) => {
  const mailOptions = {
    from: process.env.GOOGLE_USER,
    to,
    subject,
    html,
    text,
  };

  const details = await transpoter.sendMail(mailOptions);
  console.log("Email sent", details);
};

export default sendEmail;
