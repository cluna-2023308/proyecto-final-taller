import { Router } from "express"
import { register, login } from "./auth.controller.js"
import { registerValidator, loginValidator, assingClientRole } from "../middlewares/user-validators.js"
import { uploadProfilePicture } from "../middlewares/multer-uploads.js"

const router = Router()

router.post(
    "/register",
    uploadProfilePicture.single("profilePicture"), 
    registerValidator, 
    assingClientRole,
    register
)

router.post(
    "/login",
    loginValidator,
    login
)

export default router 