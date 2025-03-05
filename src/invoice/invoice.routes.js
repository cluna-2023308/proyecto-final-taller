import { Router } from "express";
import { generateInvoice } from "./invoice.controller.js";
import { generateInvoiceValidator } from "../middlewares/invoice-validators.js";

const router = Router();

/**
 * @swagger
 * /generatePDF/{cartId}:
 *   get:
 *     summary: Generate a PDF invoice for a cart
 *     tags: [Invoice]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         description: ID of the cart to generate the invoice for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PDF invoice generated successfully
 *       400:
 *         description: Invalid cart ID
 *       404:
 *         description: Cart not found
 */
router.get("/generatePDF/:cartId", generateInvoiceValidator, generateInvoice);

export default router;
