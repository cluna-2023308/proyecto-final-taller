import express from 'express';
import { addProductToCart, updateProductQuantityInCart, removeProductFromCart } from '../cart/cart.controller.js';
import { addProductToCartValidator, updateProductQuantityInCartValidator, removeProductFromCartValidator } from "../middlewares/cart-validators.js"

const router = express.Router();

router.post("/addCart" ,addProductToCartValidator, addProductToCart);

router.patch("/updateCart", updateProductQuantityInCartValidator, updateProductQuantityInCart);

router.delete("/removeCart", removeProductFromCartValidator, removeProductFromCart)

export default router;