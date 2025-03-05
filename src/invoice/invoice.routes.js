import { Router } from "express";
import { generateInvoice } from "./invoice.controller.js";
import { generateInvoiceValidator } from "../middlewares/invoice-validators.js";
const router = Router();

router.get("/generatePDF/:cartId", generateInvoiceValidator, generateInvoice);

export default router;