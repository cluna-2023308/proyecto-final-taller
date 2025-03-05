import { param } from "express-validator";
import { cartExists } from "../helpers/db-validator.js";
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle.errors.js";
import { validateJWT } from "./validate-jwt.js";

export const generateInvoiceValidator = [
    validateJWT,
    param("cartId", "No es un ID válido").isMongoId(),
    param("cartId").custom(cartExists),
    validarCampos,
    handleErrors
]