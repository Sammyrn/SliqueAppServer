// Role constants for your e-commerce app
const ROLES = {
  USER: '200',        // Regular customers - can view products, manage cart, place orders
  ADMIN: '2004'  // Super admin - full access (your existing role)
};

// Role hierarchy (higher numbers = more permissions)
const ROLE_HIERARCHY = {
  [ROLES.USER]: 1,
  [ROLES.ADMIN]: 2,
};

// Route permissions (what each role can access)
const ROUTE_PERMISSIONS = {
  // Product routes
  'GET /api/products/getAll': [], // Public
  'POST /api/products/get/:id': [ROLES.USER, ROLES.ADMIN],
  'POST /api/products/create': [ROLES.ADMIN],
  'PUT /api/products/update/:id': [ROLES.ADMIN],
  'DELETE /api/products/delete/:id': [ROLES.ADMIN],
  
  // Cart routes
  'GET /api/cart': [ROLES.USER, ROLES.ADMIN],
  'POST /api/cart/add/:id': [ROLES.USER, ROLES.ADMIN],
  'PUT /api/cart/put/:id': [ROLES.USER, ROLES.ADMIN],
  'DELETE /api/cart/delete/:id': [ROLES.USER, ROLES.ADMIN],
  
  // Order routes (future)
  'GET /api/orders': [ROLES.USER, ROLES.ADMIN],
  'POST /api/orders/create': [ROLES.USER, ROLES.ADMIN],
  'PUT /api/orders/:id/status': [ROLES.ADMIN],
  
  // Admin routes
  'GET /api/admin/dashboard': [ROLES.ADMIN],
  'GET /api/admin/users': [ROLES.SUPER_ADMIN],
};

module.exports = {
  ROLES,
  ROLE_HIERARCHY,
  ROUTE_PERMISSIONS
}; 