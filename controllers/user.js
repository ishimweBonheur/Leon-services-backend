const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const userService = require('../services/user');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register user
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, username, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }, { phone }] });

    if (existingUser) {
      let conflictField;
      if (existingUser.email === email) conflictField = "email";
      else if (existingUser.username === username) conflictField = "username";
      else if (existingUser.phone === phone) conflictField = "phone";

      return res.status(400).json({
        error: `A user with this ${conflictField} already exists. Please use a different ${conflictField}.`
      });
    }

    const user = await new User({ firstName, lastName, username, email, phone, password, role }).save();
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user, token });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      res.status(400).json({
        error: `A user with this ${duplicateField} already exists: ${error.keyValue[duplicateField]}. Please use a different ${duplicateField}.`
      });
    } else if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ error: `Validation failed: ${validationErrors.join(", ")}` });
    } else {
      res.status(500).json({ error: `Server error: ${error.message}` });
    }
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Google Authentication
const googleAuth = async (req, res) => {
  try {
    const tokenId = req.body.tokenId || req.body.id_token;

    if (!tokenId) {
      return res.status(400).json({ error: 'Google token is required' });
    }

    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ error: 'Invalid Google token payload' });
    }

    const { email, name, picture, email_verified } = payload;

    if (!email || !email_verified) {
      return res.status(400).json({ error: 'Verified email is required from Google account' });
    }

    const nameParts = name ? name.split(' ') : [''];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    let user = await User.findOne({ email });

    if (!user) {
      const usernameBase = email.split('@')[0];
      const usernameExists = await User.findOne({ username: usernameBase });
      const finalUsername = usernameExists
        ? `${usernameBase}${Date.now().toString().slice(-4)}`
        : usernameBase;

      user = new User({
        email,
        firstName,
        lastName,
        username: finalUsername,
        profilePicture: picture,
        isVerified: true,
        authMethod: 'google',
      });

      await user.save();
    } else if (user.authMethod !== 'google') {
      user.authMethod = user.authMethod === 'password' ? 'multiple' : 'google';
      await user.save();
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      message: 'User authenticated successfully with Google',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      error: 'Google authentication failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const checkUser = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);

    if (!user) {
      return res.status(404).json({ error: "User not found. Please check the provided user ID." });
    }

    res.status(200).json(user);
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        error: `A user with this ${duplicateField} already exists: ${error.keyValue[duplicateField]}. Please use a different ${duplicateField}.`
      });
    }

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: `Validation failed: ${validationErrors.join(", ")}` });
    }

    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};

const deleteUser = async (req, res) => {
  try {
    const updatedUser = await userService.deleteUser(req.params.id);
    res.status(200).json({ message: 'User deactivated', user: updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const activeUsers = res.pagination.list.filter(user => user.is_active);
    res.status(200).json({
      ...res.pagination,
      list: activeUsers,
      total: activeUsers.length,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const activeUser = async (req, res) => {
  try {
    const user = await userService.disableUser(req.params.id);
    const message = user.is_active ? "User activated successfully" : "User deactivated successfully";
    res.json({ message, user });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    } else {
      return res.status(500).json({ error: 'Failed to disable User' });
    }
  }
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  activeUser,
  registerUser,
  loginUser,
  checkUser,
  googleAuth,
};
