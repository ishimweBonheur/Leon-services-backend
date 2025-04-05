// middlewares/user.js

// Example authorization middleware
export function authorizeRoles(...roles) {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ msg: 'Not authorized' });
      }
      next();
    };
  }
  
  // Authentication middleware
  export function   authenticate(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach the user info to the request object
      next();
    } catch (err) {
      res.status(401).json({ msg: 'Token is not valid' });
    }
  }
  