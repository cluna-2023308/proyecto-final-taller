import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle.errors.js";
import { validateJWT } from "./validate-jwt.js";

export const addProductToCartValidator = [
    validateJWT,
    validarCampos,
    handleErrors
]

export const removeProductFromCartValidator = [
    validateJWT,
    validarCampos,
    handleErrors
]

export const updateProductQuantityInCartValidator = [
    validateJWT,
    validarCampos,
    handleErrors
]