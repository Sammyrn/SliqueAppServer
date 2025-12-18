const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // Ensure user data is available (from verifyToken middleware)
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if user has any of the allowed roles
    const userRole = req.user.role;

    
    // Convert single role to array for easier checking
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const isNotRoles = !roles.includes(userRole)
    //console.log(isNotRoles)
    
    if (isNotRoles) {
      return res.status(403).json({ 
        message: 'Insufficient permissions',
        requiredRoles: roles,
        userRole: userRole,
        user: req.user
      });
    }

    next();
  };
};

// Convenience middleware for specific roles
const requireUser = checkRole(['2000']);
const requireAdmin = checkRole(['2004']);

// Export the flexible checkRole function and convenience functions
module.exports = {
  checkRole,
  requireUser,
  requireAdmin
}; 