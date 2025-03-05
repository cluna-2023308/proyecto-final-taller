import { Router } from "express"
import { getUserById, getUsers, deleteUser, updatePassword, updateUser, updateProfilePicture, deleteClient, updateClient, updateRoleAdmin } from "./user.controller.js"
import { getUserByIdValidator, deleteUserValidator, updatePasswordValidator, updateUserValidator, updateProfilePictureValidator, getUsersValidator, deleteClientValidator, updateClientValidator, updateRoleAdminValidator } from "../middlewares/user-validators.js"
import { uploadProfilePicture } from "../middlewares/multer-uploads.js"

const router = Router()

// Routes de ADMIN
router.get("/", getUsersValidator, getUsers)

router.get("/findUser/:uid", getUserByIdValidator, getUserById)

router.delete("/deleteClient/:uid", deleteClientValidator, deleteClient)

router.put("/updateClient/:uid", updateClientValidator, updateClient)

router.patch("/updateRoleAdmin/:uid", updateRoleAdminValidator, updateRoleAdmin)

// Routes de CLIENT and ADMIN
router.patch("/updatePassword/:uid", updatePasswordValidator, updatePassword)

router.patch("/updateProfilePicture/:uid", uploadProfilePicture.single("profilePicture"),  updateProfilePictureValidator, updateProfilePicture)

router.delete("/deleteUser", deleteUserValidator, deleteUser)

router.put("/updateUser", updateUserValidator, updateUser)

export default router