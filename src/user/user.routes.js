import { Router } from "express"
import { getUserById, getUsers, deleteUser, updatePassword, updateUser, updateProfilePicture, deleteClient, updateClient } from "./user.controller.js"
import { getUserByIdValidator, deleteUserValidator, updatePasswordValidator, updateUserValidator, updateProfilePictureValidator, getUsersValidator, deleteClientValidator, updateClientValidator } from "../middlewares/user-validators.js"
import { uploadProfilePicture } from "../middlewares/multer-uploads.js"

const router = Router()

router.get("/findUser/:uid", getUserByIdValidator, getUserById)

router.get("/", getUsersValidator, getUsers)

router.delete("/deleteClient/:uid", deleteClientValidator, deleteClient)

router.put("/updateClient/:uid", updateClientValidator, updateClient)

router.delete("/deleteUser/:uid", deleteUserValidator, deleteUser)

router.patch("/updatePassword/:uid", updatePasswordValidator, updatePassword)

router.patch("/updateProfilePicture/:uid", uploadProfilePicture.single("profilePicture"),  updateProfilePictureValidator, updateProfilePicture)

router.put("/updateUser/:uid", updateUserValidator, updateUser)

export default router