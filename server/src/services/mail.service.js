import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: "Keval <noreply@keval.space>", // 🔥 YOUR DOMAIN
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", response);
    return true;
  } catch (err) {
    console.log("❌ Email error:", err.message);
    return false;
  }
};

export default sendEmail;