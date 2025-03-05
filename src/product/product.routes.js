import { Router } from "express";
import { createProduct, getProducts, updateProduct, deleteProduct, searchProductByName, listProductsFilter, searchProductsByTypeCategory } from "./product.controller.js";
import { createProductValidator, updateProductValidator, deleteProductValidator, getProductValidator } from "../middlewares/product-validators.js"

const router = Router();
//ADMIN routes
router.post("/createProduct", createProductValidator, createProduct);

router.patch("/updateProduct/:id", updateProductValidator, updateProduct);

router.delete("/deleteProduct/:id", deleteProductValidator, deleteProduct);

//CLIENT AND ADMIN routes
router.get("/", getProductValidator ,getProducts);

router.get("/searchProductByName", searchProductByName);

router.get("/searchProductsByTypeCategory", searchProductsByTypeCategory);

router.get("/listProductsFilter", listProductsFilter);

export default router;