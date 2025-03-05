import { Router } from "express"
import { getUserById, getUsers, deleteUser, updatePassword, updateUser, updateProfilePicture, deleteClient, updateClient, updateRoleAdmin } from "./user.controller.js"
import { getUserByIdValidator, deleteUserValidator, updatePasswordValidator, updateUserValidator, updateProfilePictureValidator, getUsersValidator, deleteClientValidator, updateClientValidator, updateRoleAdminValidator } from "../middlewares/user-validators.js"
import { uploadProfilePicture } from "../middlewares/multer-uploads.js"

const router = Router()

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", getUsersValidator, getUsers);

/**
 * @swagger
 * /findUser/{uid}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User data
 */
router.get("/findUser/:uid", getUserByIdValidator, getUserById);

/**
 * @swagger
 * /deleteClient/{uid}:
 *   delete:
 *     summary: Delete a client
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Client deleted
 */
router.delete("/deleteClient/:uid", deleteClientValidator, deleteClient);

/**
 * @swagger
 * /updateClient/{uid}:
 *   put:
 *     summary: Update a client
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Client updated
 */
router.put("/updateClient/:uid", updateClientValidator, updateClient);

/**
 * @swagger
 * /updateRoleAdmin/{uid}:
 *   patch:
 *     summary: Update user role to admin
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role updated
 */
router.patch("/updateRoleAdmin/:uid", updateRoleAdminValidator, updateRoleAdmin);

/**
 * @swagger
 * /updatePassword/{uid}:
 *   patch:
 *     summary: Update user password
 *     tags: [Client, Admin]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Password updated
 */
router.patch("/updatePassword/:uid", updatePasswordValidator, updatePassword);

/**
 * @swagger
 * /updateProfilePicture/{uid}:
 *   patch:
 *     summary: Update profile picture
 *     tags: [Client, Admin]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile picture updated
 */
router.patch("/updateProfilePicture/:uid", uploadProfilePicture.single("profilePicture"), updateProfilePictureValidator, updateProfilePicture);

/**
 * @swagger
 * /deleteUser:
 *   delete:
 *     summary: Delete a user
 *     tags: [Client, Admin]
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete("/deleteUser", deleteUserValidator, deleteUser);

/**
 * @swagger
 * /updateUser:
 *   put:
 *     summary: Update user details
 *     tags: [Client, Admin]
 *     responses:
 *       200:
 *         description: User updated
 */
router.put("/updateUser", updateUserValidator, updateUser);

export default router;
