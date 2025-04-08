const jwt = require('jsonwebtoken');
const User = require('../models/User');

const userService = require('../services/user');

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, username, email, phone, password, role } = req.body;

    // Check if the user already exists by email, username, or phone
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }, { phone }] 
    });

    if (existingUser) {
      let conflictField;
      if (existingUser.email === email) conflictField = "email";
      else if (existingUser.username === username) conflictField = "username";
      else if (existingUser.phone === phone) conflictField = "phone";

      return res.status(400).json({ 
        error: `A user with this ${conflictField} already exists. Please use a different ${conflictField}.`
      });
    }

    // Create new user
    const user = await new User({ firstName, lastName, username, email, phone, password, role }).save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user, token });
  } catch (error) {
    if (error.code === 11000) {
      // Handle MongoDB duplicate key error
      const duplicateField = Object.keys(error.keyValue)[0];
      res.status(400).json({
        error: `A user with this ${duplicateField} already exists: ${error.keyValue[duplicateField]}. Please use a different ${duplicateField}.`
      });
    } else if (error.name === "ValidationError") {
      // Handle Mongoose validation errors
      const validationErrors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ error: `Validation failed: ${validationErrors.join(", ")}` });
    } else {
      // Handle generic server errors
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
      // Handle duplicate key error
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



// this is the controller  to deactivate the user 
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


 const activeUser = async (req,res) =>{
    try {
      const user = await userService.disableUser(req.params.id);
      const message = user.is_active === true ? "User activated successfully" : " User disactivated successfully"
      res.json({message,user});
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: 'User not found' });
      } else {
        return res.status(500).json({ error: 'Failed to disable User' });
      }
    }
  }
module.exports = { createUser, updateUser, deleteUser,getAllUsers,activeUser ,registerUser, loginUser,checkUser,loginUser };


