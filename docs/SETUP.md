# Setup Guide

This guide will walk you through setting up the E-Commerce Platform on your local development environment.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/)
- **Git** - [Download here](https://git-scm.com/)

### Verify Installation

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check MySQL version
mysql --version

# Check Git version
git --version
```

## 🚀 Installation Steps

### 1. Clone the Repository

```bash
# Clone the repository
git clone <your-repository-url>
cd e-commerce-platform

# Verify the structure
ls -la
```

You should see:
```
├── client/
├── server/
├── docs/
└── README.md
```

### 2. Database Setup

#### Create MySQL Database

```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE ecommerce_db;

# Create user (optional but recommended)
CREATE USER 'ecommerce_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecommerce_user'@'localhost';
FLUSH PRIVILEGES;

# Exit MySQL
EXIT;
```

#### Import Database Schema

```bash
# Navigate to server directory
cd server

# Import the schema (if you have a schema file)
mysql -u ecommerce_user -p ecommerce_db < database-schema.sql
```

### 3. Backend Setup

#### Install Dependencies

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install
```

#### Environment Configuration

Create a `.env` file in the `server/` directory:

```bash
# Create .env file
touch .env
```

Add the following configuration to `.env`:

```env
# Server Configuration
PORT=5050
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=ecommerce_user
DB_PASSWORD=your_password
DB_NAME=ecommerce_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

#### Test Backend Connection

```bash
# Start the server
npm start
```

You should see:
```
Server is running on port 5050
Database connected successfully
```

### 4. Frontend Setup

#### Install Dependencies

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install
```

#### Environment Configuration (Optional)

Create a `.env` file in the `client/` directory if you need to override default settings:

```env
# API Configuration
VITE_API_URL=http://localhost:5050/api

# Socket Configuration
VITE_SOCKET_URL=http://localhost:5050

# Paystack Configuration
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key
```

#### Test Frontend

```bash
# Start development server
npm run dev
```

You should see:
```
  VITE v7.0.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## 🔧 Configuration Details

### Database Configuration

The application uses MySQL with the following default settings:

- **Host**: localhost
- **Port**: 3306
- **Database**: ecommerce_db
- **User**: ecommerce_user
- **Password**: your_password

### API Configuration

- **Base URL**: http://localhost:5050/api
- **CORS**: Configured for http://localhost:5173
- **Rate Limiting**: Enabled on all endpoints

### File Upload Configuration

- **Max File Size**: 5MB
- **Allowed Types**: jpg, jpeg, png, gif
- **Storage**: Local uploads directory + Cloudinary

## 🧪 Testing the Setup

### 1. Test Backend API

```bash
# Test server health
curl http://localhost:5050/api/health

# Expected response
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Test Frontend

1. Open http://localhost:5173 in your browser
2. You should see the e-commerce homepage
3. Test navigation between pages

### 3. Test Database Connection

```bash
# Check if database is accessible
mysql -u ecommerce_user -p -e "USE ecommerce_db; SHOW TABLES;"
```

## 🔑 Third-Party Services Setup

### Paystack Setup

1. Create a Paystack account at [paystack.com](https://paystack.com)
2. Get your API keys from the dashboard
3. Add keys to your `.env` file

### Cloudinary Setup

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name, API key, and secret
3. Add credentials to your `.env` file

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Error

**Error**: `ER_ACCESS_DENIED_ERROR`

**Solution**:
```bash
# Check MySQL user permissions
mysql -u root -p -e "SHOW GRANTS FOR 'ecommerce_user'@'localhost';"

# Recreate user if needed
DROP USER 'ecommerce_user'@'localhost';
CREATE USER 'ecommerce_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecommerce_user'@'localhost';
FLUSH PRIVILEGES;
```

#### 2. Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5050`

**Solution**:
```bash
# Find process using port 5050
lsof -i :5050

# Kill the process
kill -9 <PID>

# Or change port in .env
PORT=5051
```

#### 3. Node Modules Issues

**Error**: `Cannot find module`

**Solution**:
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. CORS Error

**Error**: `Access to fetch at 'http://localhost:5050/api' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solution**:
- Check that `FRONTEND_URL` in `.env` matches your frontend URL
- Ensure CORS middleware is properly configured

### Performance Optimization

#### 1. Database Optimization

```sql
-- Add indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
```

#### 2. Node.js Optimization

```bash
# Use Node.js with better performance
export NODE_OPTIONS="--max-old-space-size=4096"
```

## 📊 Monitoring

### Health Check Endpoint

```bash
# Check server health
curl http://localhost:5050/api/health
```

### Database Monitoring

```sql
-- Check database status
SHOW STATUS LIKE 'Connections';
SHOW STATUS LIKE 'Threads_connected';
```

## 🔄 Development Workflow

### 1. Start Development Servers

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm run dev
```

### 2. Code Changes

- Backend changes auto-restart with nodemon
- Frontend changes auto-reload with Vite HMR

### 3. Database Changes

```bash
# Apply database migrations
mysql -u ecommerce_user -p ecommerce_db < migrations/new_migration.sql
```

## 🚀 Production Deployment

### Environment Variables

Update `.env` for production:

```env
NODE_ENV=production
PORT=3000
DB_HOST=your_production_db_host
JWT_SECRET=your_production_jwt_secret
PAYSTACK_SECRET_KEY=sk_live_your_live_key
```

### Build for Production

```bash
# Build frontend
cd client
npm run build

# Start production server
cd ../server
npm start
```

## 📞 Support

If you encounter issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the [API Documentation](API.md)
3. Check the [Architecture Documentation](ARCHITECTURE.md)
4. Create an issue in the repository

## 🔄 Updates

To update the application:

```bash
# Pull latest changes
git pull origin main

# Update dependencies
cd server && npm install
cd ../client && npm install

# Restart servers
npm start
```
