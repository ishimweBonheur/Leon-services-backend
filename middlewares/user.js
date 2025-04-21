const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware for access token
exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    console.error("Access Token Verification Error:", err);
    return res.status(401).json({ msg: 'Invalid or expired access token' });
  }
};

// Middleware to protect refresh token routes (optional)
exports.verifyRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.status(401).json({ msg: 'No refresh token provided' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    req.user = decoded; // only contains id, not full user
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid or expired refresh token' });
  }
};

// Role-based access control
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Access denied: insufficient role' });
    }

    next();
  };
};
