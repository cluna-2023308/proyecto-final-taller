import { Router } from "express";
import { createProduct, getProducts, updateProduct, deleteProduct, searchProductByName, listProductsFilter, searchProductsByTypeCategory } from "./product.controller.js";
import { createProductValidator, updateProductValidator, deleteProductValidator, getProductValidator } from "../middlewares/product-validators.js"

const router = Router();

/**
 * @swagger
 * /createProduct:
 *   post:
 *     summary: Create a new product
 *     tags: [Product Admin]
 *     responses:
 *       200:
 *         description: Product created
 */
router.post("/createProduct", createProductValidator, createProduct);

/**
 * @swagger
 * /updateProduct/{id}:
 *   patch:
 *     summary: Update a product
 *     tags: [Product Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product updated
 */
router.patch("/updateProduct/:id", updateProductValidator, updateProduct);

/**
 * @swagger
 * /deleteProduct/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Product Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.delete("/deleteProduct/:id", deleteProductValidator, deleteProduct);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all products
 *     tags: [Product Client, Admin]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/", getProductValidator, getProducts);

/**
 * @swagger
 * /searchProductByName:
 *   get:
 *     summary: Search for a product by name
 *     tags: [Product Client, Admin]
 *     responses:
 *       200:
 *         description: Product details
 */
router.get("/searchProductByName", searchProductByName);

/**
 * @swagger
 * /searchProductsByTypeCategory:
 *   get:
 *     summary: Search products by type and category
 *     tags: [Product Client, Admin]
 *     responses:
 *       200:
 *         description: List of products by type and category
 */
router.get("/searchProductsByTypeCategory", searchProductsByTypeCategory);

/**
 * @swagger
 * /listProductsFilter:
 *   get:
 *     summary: List products with filters
 *     tags: [Product Client, Admin]
 *     responses:
 *       200:
 *         description: Filtered list of products
 */
router.get("/listProductsFilter", listProductsFilter);

export default router;
