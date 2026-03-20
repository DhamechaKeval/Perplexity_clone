import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // required for 465
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_USER_PASS, // App Password ONLY
  },
  connectionTimeout: 10000, // prevent hanging
});

if (process.env.NODE_ENV !== "production") {
  transporter
    .verify()
    .then(() => console.log("Email transporter ready"))
    .catch((err) => console.log("Email transporter error:", err.message));
}
const sendEmail = async ({to, subject, html, text}) => {
  const mailOptions = {
    from: process.env.GOOGLE_USER,
    to,
    subject,
    html,
    text,
  };

  const details = await transporter.sendMail(mailOptions);
  console.log("Email sent", details);
};

export default sendEmail;
