import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_USER_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 20000,
});

if (process.env.NODE_ENV !== "production") {
  transporter
    .verify()
    .then(() => console.log("Email transporter ready"))
    .catch((err) => console.log("Email transporter error:", err.message));
}

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const details = await transporter.sendMail({
      from: process.env.GOOGLE_USER,
      to,
      subject,
      html,
      text,
    });

    console.log("Email sent", details.messageId);
    return true;
  } catch (err) {
    console.log("Email error:", err.message);
    return false;
  }
};

export default sendEmail;
