# API Documentation

This document provides detailed information about all available API endpoints for the E-Commerce Platform.

## Base URL
```
http://localhost:5050/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this standard format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "error": null
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "error": "ERROR_CODE"
}
```

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "customer",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login User
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Logout User
**POST** `/auth/logout`

Logout user and invalidate token.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}
```

---

## 📦 Product Endpoints

### Get All Products
**GET** `/product`

Retrieve all available products with optional filtering.

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page
- `category` (optional): Filter by category
- `search` (optional): Search in product name/description
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter

**Response:**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Wireless Headphones",
        "description": "High-quality wireless headphones",
        "price": 99.99,
        "category": "Electronics",
        "image": "https://cloudinary.com/...",
        "stock": 50,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "itemsPerPage": 20
    }
  }
}
```

### Get Product by ID
**GET** `/product/:id`

Retrieve a specific product by its ID.

**Response:**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": 1,
    "name": "Wireless Headphones",
    "description": "High-quality wireless headphones with noise cancellation",
    "price": 99.99,
    "category": "Electronics",
    "image": "https://cloudinary.com/...",
    "stock": 50,
    "specifications": {
      "brand": "TechAudio",
      "connectivity": "Bluetooth 5.0",
      "batteryLife": "20 hours"
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Create Product (Admin Only)
**POST** `/product`

Create a new product (requires admin role).

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 49.99,
  "category": "Electronics",
  "stock": 100,
  "specifications": {
    "brand": "BrandName",
    "model": "Model123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 2,
    "name": "New Product",
    "description": "Product description",
    "price": 49.99,
    "category": "Electronics",
    "stock": 100,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Update Product (Admin Only)
**PUT** `/product/:id`

Update an existing product (requires admin role).

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "price": 59.99,
  "stock": 75
}
```

### Delete Product (Admin Only)
**DELETE** `/product/:id`

Delete a product (requires admin role).

**Headers:** `Authorization: Bearer <admin-token>`

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": null
}
```

---

## 🛒 Cart Endpoints

### Get User Cart
**GET** `/cart`

Retrieve the current user's shopping cart.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Cart retrieved successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "productId": 1,
        "productName": "Wireless Headphones",
        "price": 99.99,
        "quantity": 2,
        "image": "https://cloudinary.com/...",
        "subtotal": 199.98
      }
    ],
    "total": 199.98,
    "itemCount": 2
  }
}
```

### Add Item to Cart
**POST** `/cart/add`

Add a product to the user's cart.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to cart successfully",
  "data": {
    "cartItem": {
      "id": 1,
      "productId": 1,
      "quantity": 2,
      "userId": 1
    }
  }
}
```

### Update Cart Item
**PUT** `/cart/update`

Update the quantity of an item in the cart.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 3
}
```

### Remove Item from Cart
**DELETE** `/cart/remove/:productId`

Remove an item from the cart.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart successfully",
  "data": null
}
```

---

## 📋 Order Endpoints

### Get User Orders
**GET** `/orders`

Retrieve all orders for the current user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number for pagination
- `status` (optional): Filter by order status

**Response:**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": {
    "orders": [
      {
        "id": 1,
        "orderNumber": "ORD-2024-001",
        "status": "pending",
        "total": 199.98,
        "items": [
          {
            "productId": 1,
            "productName": "Wireless Headphones",
            "quantity": 2,
            "price": 99.99
          }
        ],
        "shippingAddress": {
          "street": "123 Main St",
          "city": "New York",
          "state": "NY",
          "zipCode": "10001"
        },
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25
    }
  }
}
```

### Create Order
**POST** `/orders`

Create a new order from the user's cart.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "card"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": 1,
      "orderNumber": "ORD-2024-001",
      "status": "pending",
      "total": 199.98,
      "paymentUrl": "https://checkout.paystack.com/..."
    }
  }
}
```

### Update Order Status (Admin Only)
**PUT** `/orders/:id`

Update the status of an order (requires admin role).

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "TRK123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "order": {
      "id": 1,
      "status": "shipped",
      "trackingNumber": "TRK123456789",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

## 💳 Payment Endpoints

### Initialize Payment
**POST** `/paystack/initialize`

Initialize a payment transaction with Paystack.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "orderId": 1,
  "amount": 19998,
  "email": "customer@example.com",
  "callbackUrl": "http://localhost:5173/payment/callback"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment initialized successfully",
  "data": {
    "authorizationUrl": "https://checkout.paystack.com/...",
    "reference": "TXN123456789",
    "accessCode": "ACCESS_CODE_123"
  }
}
```

### Verify Payment
**POST** `/paystack/verify`

Verify a completed payment transaction.

**Request Body:**
```json
{
  "reference": "TXN123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "status": "success",
    "amount": 19998,
    "orderId": 1,
    "transactionId": "TXN123456789"
  }
}
```

---

## 🔧 Error Codes

| Code | Description |
|------|-------------|
| `AUTH_REQUIRED` | Authentication required |
| `INVALID_TOKEN` | Invalid or expired token |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions |
| `VALIDATION_ERROR` | Request validation failed |
| `PRODUCT_NOT_FOUND` | Product not found |
| `CART_ITEM_NOT_FOUND` | Cart item not found |
| `ORDER_NOT_FOUND` | Order not found |
| `INSUFFICIENT_STOCK` | Product stock insufficient |
| `PAYMENT_FAILED` | Payment processing failed |
| `INTERNAL_ERROR` | Internal server error |

---

## 📝 Rate Limiting

API endpoints are rate-limited to prevent abuse:
- **Authentication endpoints**: 5 requests per minute
- **Product endpoints**: 100 requests per minute
- **Cart endpoints**: 50 requests per minute
- **Order endpoints**: 20 requests per minute
- **Payment endpoints**: 10 requests per minute

---

## 🔄 WebSocket Events

The application uses Socket.io for real-time updates:

### Client Events
- `join-order-room` - Join order status room
- `leave-order-room` - Leave order status room

### Server Events
- `order-status-updated` - Order status changed
- `payment-status-updated` - Payment status changed
- `stock-updated` - Product stock updated

### Example Usage
```javascript
// Join order room
socket.emit('join-order-room', { orderId: 1 });

// Listen for order updates
socket.on('order-status-updated', (data) => {
  console.log('Order status:', data.status);
});
```
