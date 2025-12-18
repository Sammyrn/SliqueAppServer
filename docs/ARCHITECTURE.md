# Architecture Documentation

This document provides a comprehensive overview of the E-Commerce Platform's architecture, system design, and technical decisions.

## 🏗️ System Architecture Overview

The E-Commerce Platform follows a **client-server architecture** with a **monolithic backend** and **single-page application (SPA) frontend**.

```
┌─────────────────┐    HTTP/WebSocket    ┌─────────────────┐
│   Frontend      │ ◄──────────────────► │    Backend      │
│   (React SPA)   │                      │   (Node.js)     │
└─────────────────┘                      └─────────────────┘
                                                │
                                                ▼
                                        ┌─────────────────┐
                                        │   Database      │
                                        │   (MySQL)       │
                                        └─────────────────┘
                                                │
                                                ▼
                                        ┌─────────────────┐
                                        │ External APIs   │
                                        │ (Paystack,      │
                                        │  Cloudinary)    │
                                        └─────────────────┘
```

## 🎯 Design Principles

### 1. Separation of Concerns
- **Frontend**: UI/UX, state management, user interactions
- **Backend**: Business logic, data persistence, external integrations
- **Database**: Data storage and retrieval

### 2. Scalability
- Modular component architecture
- Stateless API design
- Database indexing for performance
- Caching strategies

### 3. Security
- JWT-based authentication
- Input validation and sanitization
- CORS configuration
- Rate limiting

### 4. Real-time Communication
- WebSocket connections for live updates
- Event-driven architecture
- Room-based messaging

## 🏛️ Backend Architecture

### Directory Structure

```
server/
├── config/           # Configuration files
├── controllers/      # Business logic handlers
├── middleware/       # Custom middleware
├── models/          # Database models
├── routes/          # API route definitions
├── utils/           # Utility functions
├── uploads/         # File storage
├── index.js         # Application entry point
└── package.json     # Dependencies
```

### Core Components

#### 1. Express.js Application
```javascript
// Application setup
const app = express();
const server = http.createServer(app);

// Middleware stack
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// Route registration
app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/paystack', paystackRoutes);
```

#### 2. Database Layer
- **ORM**: Custom MySQL wrapper
- **Connection Pooling**: Optimized database connections
- **Transactions**: ACID compliance for critical operations

#### 3. Authentication System
```javascript
// JWT-based authentication
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// Middleware for protected routes
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  // Token verification logic
};
```

#### 4. Real-time Communication
```javascript
// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
});

// Event handlers
io.on('connection', (socket) => {
  socket.on('join-order-room', (data) => {
    socket.join(`order-${data.orderId}`);
  });
});
```

### Data Flow

```
1. Client Request → Express Router
2. Router → Middleware (Auth, Validation)
3. Middleware → Controller
4. Controller → Model (Database)
5. Model → Database
6. Response ← Controller ← Model
7. Response → Client
```

## 🎨 Frontend Architecture

### Directory Structure

```
client/
├── src/
│   ├── components/   # Reusable UI components
│   ├── Pages/        # Page components
│   ├── context/      # React context providers
│   ├── config/       # Configuration files
│   ├── constants/    # Application constants
│   ├── assets/       # Static assets
│   ├── App.jsx       # Main application component
│   └── main.jsx      # Application entry point
├── public/           # Public assets
└── package.json      # Dependencies
```

### Core Components

#### 1. React Application Structure
```javascript
// Main App component
function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
```

#### 2. State Management
```javascript
// Zustand store for cart management
const useCartStore = create((set, get) => ({
  items: [],
  total: 0,
  
  addItem: (product, quantity) => {
    set((state) => {
      const existingItem = state.items.find(item => item.id === product.id);
      if (existingItem) {
        return {
          items: state.items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        };
      }
      return { items: [...state.items, { ...product, quantity }] };
    });
  }
}));
```

#### 3. API Integration
```javascript
// Axios instance with interceptors
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

// Request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### 4. Real-time Updates
```javascript
// Socket.io client integration
const socket = io(import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true
});

// Listen for order updates
useEffect(() => {
  socket.on('order-status-updated', (data) => {
    updateOrderStatus(data);
  });
  
  return () => {
    socket.off('order-status-updated');
  };
}, []);
```

## 🗄️ Database Design

### Entity Relationship Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Users    │    │   Products  │    │    Orders   │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id (PK)     │    │ id (PK)     │    │ id (PK)     │
│ name        │    │ name        │    │ userId (FK) │
│ email       │    │ description │    │ status      │
│ password    │    │ price       │    │ total       │
│ role        │    │ category    │    │ createdAt   │
│ createdAt   │    │ stock       │    └─────────────┘
└─────────────┘    │ image       │            │
                   │ createdAt   │            │
                   └─────────────┘            │
                           │                  │
                           │                  │
                   ┌─────────────┐    ┌─────────────┐
                   │     Cart    │    │ OrderItems  │
                   ├─────────────┤    ├─────────────┤
                   │ id (PK)     │    │ id (PK)     │
                   │ userId (FK) │    │ orderId (FK)│
                   │ productId   │    │ productId   │
                   │ quantity    │    │ quantity    │
                   │ createdAt   │    │ price       │
                   └─────────────┘    └─────────────┘
```

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('customer', 'admin') DEFAULT 'customer',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Products Table
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  stock INT DEFAULT 0,
  image VARCHAR(500),
  specifications JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Orders Table
```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  orderNumber VARCHAR(50) UNIQUE NOT NULL,
  status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  total DECIMAL(10,2) NOT NULL,
  shippingAddress JSON,
  paymentMethod VARCHAR(50),
  trackingNumber VARCHAR(100),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

## 🔄 Data Flow Patterns

### 1. User Authentication Flow

```
1. User submits login form
2. Frontend sends credentials to /api/auth/login
3. Backend validates credentials
4. Backend generates JWT token
5. Token stored in HTTP-only cookie
6. Frontend redirects to dashboard
7. Subsequent requests include token automatically
```

### 2. Product Purchase Flow

```
1. User adds product to cart
2. Cart state updated in frontend
3. Cart data synced with backend
4. User proceeds to checkout
5. Order created in database
6. Payment initialized with Paystack
7. User redirected to payment page
8. Payment verified via webhook
9. Order status updated
10. Real-time notification sent to user
```

### 3. Real-time Updates Flow

```
1. Admin updates order status
2. Backend emits Socket.io event
3. Connected clients receive update
4. Frontend updates UI accordingly
5. User sees status change immediately
```

## 🔒 Security Architecture

### 1. Authentication & Authorization

- **JWT Tokens**: Stateless authentication
- **HTTP-only Cookies**: Secure token storage
- **Role-based Access Control**: Customer vs Admin permissions
- **Token Expiration**: Automatic session management

### 2. Input Validation

```javascript
// Express-validator middleware
const validateProduct = [
  body('name').trim().isLength({ min: 1, max: 255 }),
  body('price').isFloat({ min: 0 }),
  body('stock').isInt({ min: 0 }),
  validationResult
];
```

### 3. CORS Configuration

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 4. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts'
});
```

## 📊 Performance Optimization

### 1. Database Optimization

- **Indexing**: Strategic indexes on frequently queried columns
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Optimized SQL queries
- **Caching**: Redis for frequently accessed data

### 2. Frontend Optimization

- **Code Splitting**: Lazy loading of components
- **Bundle Optimization**: Tree shaking and minification
- **Image Optimization**: WebP format and lazy loading
- **Caching**: Browser caching strategies

### 3. API Optimization

- **Pagination**: Limit data transfer
- **Compression**: Gzip compression
- **Caching**: Response caching
- **CDN**: Static asset delivery

## 🔧 Configuration Management

### Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=5050

# Database Configuration
DB_HOST=localhost
DB_USER=ecommerce_user
DB_PASSWORD=your_password
DB_NAME=ecommerce_db

# JWT Configuration
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# External Services
PAYSTACK_SECRET_KEY=sk_test_...
CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Configuration Files

```javascript
// config/database.js
module.exports = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  acquireTimeout: 60000
};
```

## 🚀 Deployment Architecture

### Development Environment

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │
│   (Vite Dev)    │    │   (Nodemon)     │
│   Port: 5173    │    │   Port: 5050    │
└─────────────────┘    └─────────────────┘
```

### Production Environment

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Proxy     │    │   Load Balancer │    │   Application   │
│   (Cloudflare)  │    │   (Nginx)       │    │   Servers       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Database      │
                       │   (MySQL)       │
                       └─────────────────┘
```

## 🔄 Monitoring & Logging

### Application Monitoring

- **Health Checks**: Regular endpoint monitoring
- **Error Tracking**: Centralized error logging
- **Performance Metrics**: Response time monitoring
- **Database Monitoring**: Query performance tracking

### Logging Strategy

```javascript
// Structured logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## 🔮 Future Enhancements

### Planned Improvements

1. **Microservices Architecture**: Split monolithic backend
2. **Event Sourcing**: CQRS pattern implementation
3. **GraphQL API**: More flexible data fetching
4. **Mobile App**: React Native implementation
5. **AI Integration**: Product recommendations
6. **Multi-tenancy**: Support for multiple stores

### Scalability Considerations

- **Horizontal Scaling**: Load balancer configuration
- **Database Sharding**: Partition data across servers
- **Caching Layer**: Redis cluster implementation
- **Message Queues**: Asynchronous processing
- **CDN Integration**: Global content delivery

## 📚 Additional Resources

- [API Documentation](API.md)
- [Setup Guide](SETUP.md)
- [Database Schema](database-schema.sql)
- [Deployment Guide](DEPLOYMENT.md)
