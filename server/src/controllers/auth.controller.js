import User from "./../models/user.model.js";
import sendEmail from "./../services/mail.service.js";

export const registerController = async (req, res) => {
  const { username, email, password } = req.body;

  const isUserExists = await User.findOne({ $or: [{ email }, { username }] });

  if (isUserExists) {
    return res.status(400).json({
      message: "User with this email or username already exists",
      success: false,
      err: "user already exists",
    });
  }

  const user = await User.create({ username, email, password });

  await sendEmail({
    to: email,
    subject: "welcome to Perplexity!",
    html: `
     <p>Hi ${username},</p>
     <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
     <p>Best regards,<br>The Perplexity Team</p>
    `,
  });

  res.status(201).json({
    message: "User registered successfully",
    success: true,
    user: {
      username: user.username,
      email: user.email,
    },
  });
};
