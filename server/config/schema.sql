use slique_sys;

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    fullname VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,   
    password_hash VARCHAR(255) NOT NULL,  
    address TEXT,                        
    phone_number VARCHAR(20),          
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
);


CREATE TABLE Products (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(255) NOT NULL,      
    description TEXT,               
    price DECIMAL(10, 2) NOT NULL,   
    stock INT NOT NULL DEFAULT 0,   
    image_url VARCHAR(2048),       
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
);

CREATE TABLE Orders (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    user_id INT NOT NULL,           
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL, 
    currentstatus enum('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') NOT NULL, 
    shipping_address TEXT NOT NULL,  
    billing_address TEXT,           
    payment_status enum('Unpaid', 'Paid', 'Refunded') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE -- Ensures referential integrity. If a user is deleted, their orders are also deleted.
);

-- Table: OrderItems
-- Stores individual items within each order. This table links Products to Orders.
CREATE TABLE OrderItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,           
    product_id INT NOT NULL,         
    quantity INT NOT NULL,         
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE, 
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE RESTRICT 
);

CREATE TABLE Cart (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
product_id INT NOT NULL,
quantity INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE, 
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE
)

-- Create refresh_tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token(255)),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
);

-- Product media table
CREATE TABLE product_media (
  id INT PRIMARY KEY,
  product_id INT,
  file_url VARCHAR(500),
  file_type ENUM('image', 'video'),
  is_main BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id)
);


-- Products table with image support
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  stock INT DEFAULT 0,
  main_image_url VARCHAR(500),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_category (category),
  INDEX idx_price (price),
  INDEX idx_created_at (created_at)
);

-- Product images table for multiple images per product
CREATE TABLE IF NOT EXISTS product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  is_main BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product_id (product_id),
  INDEX idx_is_main (is_main),
  INDEX idx_sort_order (sort_order)
);

-- Refresh tokens table (for the auth system we implemented)
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token(255)),
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
);