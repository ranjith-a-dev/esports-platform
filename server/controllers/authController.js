const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

// Regex validations
const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// REGISTER
const registerUser = async (req, res) => {
  try {
    const { inGameName, email, password } = req.body;

    // Empty validation
    if (!inGameName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Gmail validation
    if (!gmailRegex.test(email)) {
      return res.status(400).json({
        message: "Only Gmail addresses ending with @gmail.com are allowed",
      });
    }

    // Password validation
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      });
    }

    // Check existing user
    const userExists = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { inGameName },
      ],
    });

    if (userExists) {
      return res.status(400).json({
        message: "Email or In-Game Name already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      inGameName,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      inGameName: user.inGameName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Empty validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Gmail validation
    if (!gmailRegex.test(email)) {
      return res.status(400).json({
        message: "Enter a valid Gmail address",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    // Compare password
    if (
      user &&
      (await bcrypt.compare(password, user.password))
    ) {
      res.json({
        _id: user._id,
        inGameName: user.inGameName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({
        message: "Invalid email or password",
      });
    }

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};