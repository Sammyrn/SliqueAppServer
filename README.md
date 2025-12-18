# E-Commerce Platform

A full-stack e-commerce application built with React, Node.js, and Express. This platform provides a complete online shopping experience with real-time features, payment processing, and admin management.

## 🚀 Features

### Customer Features
- **User Authentication & Authorization** - Secure login/register with JWT
- **Product Browsing** - Browse products with search and filtering
- **Shopping Cart** - Add/remove items with quantity management
- **Order Management** - Place orders and track order status
- **Payment Processing** - Secure payments via Paystack integration
- **Real-time Updates** - Live order status updates using Socket.io
- **Responsive Design** - Mobile-friendly interface with Tailwind CSS

### Admin Features
- **Product Management** - Add, edit, and delete products
- **Order Management** - View and update order statuses
- **User Management** - Monitor customer accounts
- **File Upload** - Image management with Cloudinary integration

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Socket.io Client** - Real-time communication
- **Lottie React** - Animation library
- **React Paginate** - Pagination component

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud image management
- **Paystack** - Payment processing
- **Socket.io** - Real-time bidirectional communication
- **Express Validator** - Input validation

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── Pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── config/        # Configuration files
│   │   ├── constants/     # Application constants
│   │   └── assets/        # Static assets
│   ├── public/            # Public assets
│   └── package.json       # Frontend dependencies
├── server/                # Backend Node.js application
│   ├── routes/            # API route handlers
│   ├── controllers/       # Business logic
│   ├── models/           # Database models
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   ├── uploads/          # File upload directory
│   └── package.json      # Backend dependencies
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- Paystack account (for payments)
- Cloudinary account (for image storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-commerce-platform
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**

   Create `.env` file in the `server/` directory:
   ```env
   PORT=5050
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   JWT_SECRET=your_jwt_secret
   PAYSTACK_SECRET_KEY=your_paystack_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

4. **Database Setup**
   - Create a MySQL database
   - Import the database schema (see `docs/database-schema.sql`)

5. **Start the application**
   ```bash
   # Start backend server (from server/ directory)
   npm start
   
   # Start frontend development server (from client/ directory)
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5050

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Product Endpoints
- `GET /api/product` - Get all products
- `GET /api/product/:id` - Get product by ID
- `POST /api/product` - Create new product (admin)
- `PUT /api/product/:id` - Update product (admin)
- `DELETE /api/product/:id` - Delete product (admin)

### Cart Endpoints
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:id` - Remove item from cart

### Order Endpoints
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (admin)

### Payment Endpoints
- `POST /api/paystack/initialize` - Initialize payment
- `POST /api/paystack/verify` - Verify payment

For detailed API documentation, see [API.md](docs/API.md).

## 🔧 Development

### Available Scripts

**Frontend (client/)**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

**Backend (server/)**
```bash
npm start        # Start server with nodemon
npm test         # Run tests
```

### Code Style
- ESLint configuration for consistent code style
- Prettier for code formatting
- React hooks best practices

## 🚀 Deployment

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy the `dist/` folder to your hosting service

### Backend Deployment
1. Set up environment variables on your server
2. Install dependencies: `npm install --production`
3. Start the server: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🔄 Version History

- **v1.0.0** - Initial release with core e-commerce features
- Real-time order updates
- Payment integration
- Admin dashboard
- Responsive design
