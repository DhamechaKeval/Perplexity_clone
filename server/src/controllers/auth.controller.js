import User from "./../models/user.model.js";
import sendEmail from "./../services/mail.service.js";
import jwt from "jsonwebtoken";

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

  const verificationToken = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
  );

  await sendEmail({
    to: email,
    subject: "welcome to Perplexity!",
    html: `
     <p>Hi ${username},</p>
     <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
      <p>To get started, please verify your email address by clicking the link below:</p>
      <p><a href="http://localhost:3000/api/auth/verify-email?token=${verificationToken}">Verify Email</a></p>

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

export const verifyEmailController = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email: decoded.email });

    user.isVerified = true;

    await user.save();

    const html = `
    <h1>Email Verified Successfully!</h1>
    <p>Your email has been verified. You can now log in to your account.</p>
    <a href="http://localhost:3000/login">Go to Login</a>
    `;

    return res.send(html);
  } catch (err) {
    res.status(400).json({
      message: "Invalid or expired token",
      success: false,
      err: err.message,
    });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  const isUserExists = await User.findOne({ email });

  if (!isUserExists) {
    return res.status(400).json({
      message: "Invalid email or password",
      success: false,
      err: "user does not exist",
    });
  }

  const isPasswordMatch = await isUserExists.comparePassword(password);

  if (!isPasswordMatch) {
    return res.status(400).json({
      message: "Invalid email or password",
      success: false,
      err: "invalid password",
    });
  }

  if (!isUserExists.isVerified) {
    return res.status(400).json({
      message: "Please verify your email before logging in",
      success: false,
      err: "email not verified",
    });
  }

  const token = jwt.sign(
    { id: isUserExists._id, username: isUserExists.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "User logged in successfully",
    success: true,
    user: {
      username: isUserExists.username,
      email: isUserExists.email,
    },
  });
};

export const getMeController = async (req, res) => {
  const { id } = req.user;

  const user = await User.findById(id).select("-password");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
      err: "user not found",
    });
  }

  res.status(200).json({
    message: "User details fetched successfully",
    success: true,
    user,
  });
};
