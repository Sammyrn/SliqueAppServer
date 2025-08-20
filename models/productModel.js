const db = require("../config/db");

// Get all products
exports.getAllProducts = async () => {
  try {
    const results = await db.query(
      "SELECT * FROM products ORDER BY created_at DESC"
    );
    return results;
  } catch (error) {
    throw error;
  }
};

// Get product by ID
exports.getProductById = async (id) => {
  try {
    const results = await db.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );
    return results[0];
  } catch (error) {
    throw error;
  }
};

// Create new product
exports.createProduct = async (productData, uploadedFiles) => {
  const { 
    name, 
    description, 
    price,  
    stock= true, 
    image_url = uploadedFiles,
  } = productData;

  try {
    const result = await db.query(
      `INSERT INTO products (name, description, price, stock, image_url) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, description, price, stock, image_url]
    );

    return {
      id: result.insertId,
      name,
      description,
      price,
      stock,
      image_url,
    };
  } catch (error) {
    console.log(error)
    throw error;
  }
};

// Update product
exports.updateProduct = async (id, productData, uploadedFiles) => {
  const { 
    name, 
    description, 
    price,  
    stock, 
    image_url = uploadedFiles,
  } = productData;

  try {
    await db.query(
      `UPDATE products 
       SET name = ?, description = ?, price = ?, stock = ?, image_url = ?, updated_at = NOW()
       WHERE id = ?`,
      [name, description, price,  stock, image_url, id]
    );

    return { id, ...productData };
  } catch (error) {
    throw error;
  }
};

exports.updateProductStock = async (id, stock) => {

  try {
    await db.query(
      `UPDATE products 
       SET stock = ?, updated_at = NOW()
       WHERE id = ?`,
      [stock, id]
    );

    return { id, stock };
  } catch (error) {
    throw error;
  }
};

// Delete product
exports.deleteProduct = async (id) => {
  try {
    const result = await db.query("DELETE FROM products WHERE id = ?", [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

// Add product image
exports.addProductImage = async (productId, imageUrl, isMain = false) => {
  try {
    // If this is the main image, unset other main images
    if (isMain) {
      await db.query(
        "UPDATE product_images SET is_main = FALSE WHERE product_id = ?",
        [productId]
      );
    }

    const result = await db.query(
      `INSERT INTO product_images (product_id, image_url, is_main) 
       VALUES (?, ?, ?)`,
      [productId, imageUrl, isMain]
    );

    return {
      id: result.insertId,
      product_id: productId,
      image_url: imageUrl,
      is_main: isMain
    };
  } catch (error) {
    throw error;
  }
};

// Get product images
exports.getProductImages = async (productId) => {
  try {
    const results = await db.query(
      "SELECT * FROM product_images WHERE product_id = ? ORDER BY is_main DESC, created_at ASC",
      [productId]
    );
    return results;
  } catch (error) {
    throw error;
  }
};

// Delete product image
exports.deleteProductImage = async (imageId) => {
  try {
    const result = await db.query("DELETE FROM product_images WHERE id = ?", [imageId]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};
