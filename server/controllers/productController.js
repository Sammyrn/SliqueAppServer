const productModel = require("../models/productModel.js");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");

exports.getAllProducts = async (req, res) => {
  try {
    const [products] = await productModel.getAllProducts();
    res.status(200).json(products || []); // Return an empty array if no products found
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const [product] = await productModel.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "success", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  const productData = req.body;

  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "products",
      });

      uploadedFiles.push(result.secure_url);
      fs.unlinkSync(file.path); // Delete local file
    }

    const newProduct = await productModel.createProduct(
      productData,
      JSON.stringify(uploadedFiles)
    );

    res.status(201).json({ message: "success" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
    console.log("error", error);
  }
};

exports.updateProduct = async (req, res) => {
  const id = req.body.id;
  const productData = req.body;

  if (!id) {
    return res.status(400).json({ message: "Product ID is required" });
  }
  console.log("Updating product with ID:", id);
  try {
    const uploadedFiles = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });

        uploadedFiles.push(result.secure_url);
        fs.unlinkSync(file.path); // Delete local file
      }
    }

    const imagesPayload =
      uploadedFiles.length > 0 ? JSON.stringify(uploadedFiles) : undefined;

      
    const updatedProduct = await productModel.updateProduct(
      id,
      productData,
      imagesPayload
    );

    res.status(200).json({ message: "success", updatedProduct });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
      console.log("error", error);
  }
};

exports.toggleProductInStock = async (req, res) => {
  const id = req.params;
  const stock = req.body.stock;

  if (!id) {
    return res.status(400).json({ message: "Product ID is required" });
  }
  console.log("Updating product with ID:", id);
  try {

    const updatedProduct = await productModel.updateProductStock(
      id,
      stock
    );

    res.status(200).json({ message: "success", updatedProduct });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
      console.log("error", error);
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Product ID is required" });
  }
  try {
    await productModel.deleteProduct(id);
    console.log("Product deleted:", id);
    // Optionally, you can delete images from Cloudinary if needed
    // await cloudinary.uploader.destroy(deletedProduct.public_id);
    res.status(200).json({ message: "success" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};
