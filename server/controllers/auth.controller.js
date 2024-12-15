import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { addDefaultRoles, Role } from "../models/role.model.js";

const signUp = async (req, res, next) => {
  try {
    // Ensure default roles exist (admin and user)
    await addDefaultRoles();

    const { username, email, password } = req.body;

    // Check if the user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Fetch the role reference (either provided by user or default to 'user')
    const role = await Role.findOne({ name: "user" });

    // If role doesn't exist in the database, you could send an error
    if (!role) {
      return res.status(400).json({ message: "Role does not exist" });
    }

    // Create a new user
    const user = new User({
      username,
      email,
      password,
      role: role._id, // Save the reference to the role
    });

    // Hash the password before saving (bcrypt hashing logic is handled by the pre-save hook)
    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate("role");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token // algorithm - HS512
    const token = jwt.sign(
      { userId: user._id, role: user.role.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

const reset = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and new password are required." });
    }

    const isAvailable = await User.findOne({ email });
    if (!isAvailable) {
      return res.status(404).json({ message: "User not found" });
    }
    // Hash the new password before updating it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};

export { signUp, login, reset };
