import express from 'express';
import { addProductToCart, updateProductQuantityInCart, removeProductFromCart } from '../cart/cart.controller.js';
import { addProductToCartValidator, updateProductQuantityInCartValidator, removeProductFromCartValidator } from "../middlewares/cart-validators.js"

const router = express.Router();

/**
 * @swagger
 * /addCart:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "12345"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Product added to cart
 */
router.post("/addCart", addProductToCartValidator, addProductToCart);

/**
 * @swagger
 * /updateCart:
 *   patch:
 *     summary: Update product quantity in the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "12345"
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart updated
 */
router.patch("/updateCart", updateProductQuantityInCartValidator, updateProductQuantityInCart);

/**
 * @swagger
 * /removeCart:
 *   delete:
 *     summary: Remove a product from the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: Product removed from cart
 */
router.delete("/removeCart", removeProductFromCartValidator, removeProductFromCart);

export default router;