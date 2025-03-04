import { hash } from "argon2";
import User from "./user.model.js"
import fs from "fs/promises"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

// ADMIN ROLE METHODS -------------------------

export const getUsers = async (req, res) => {
    try{
        const { limite = 5, desde = 0 } = req.query
        const query = { status: true }

        const [total, users ] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        return res.status(200).json({
            success: true,
            total,
            users
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error al obtener los usuarios",
            error: err.message
        })
    }
}

export const getUserById = async (req, res) => {
    try {
        const { usuario } = req;
        const { uid } = req.params;

        if (!usuario || usuario.role !== "ADMIN_ROLE") {
            return res.status(401).json({
                success: false,
                message: "Acceso denegado. Se requiere el rol de ADMIN_ROLE."
            });
        }
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }
        return res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener el usuario",
            error: err.message
        });
    }
};

export const deleteClient = async (req, res) => {
    try {
        const { usuario } = req;
        const { uid } = req.params;

        if (!usuario || usuario.role !== "ADMIN_ROLE") {
            return res.status(401).json({
                success: false,
                message: "Acceso denegado. Se requiere el rol de ADMIN_ROLE."
            });
        }

        const user = await User.findByIdAndUpdate(uid, { status: false }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Usuario eliminado",
            user
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar el usuario",
            error: err.message
        });
    }
};

export const updateClient = async (req, res) => {
    try {
        const { usuario } = req;
        const { uid } = req.params;
        const data = req.body;

        if (!usuario || usuario.role !== "ADMIN_ROLE") {
            return res.status(401).json({
                success: false,
                message: "Acceso denegado. Se requiere el rol de ADMIN_ROLE."
            });
        }

        if (Object.keys(data).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No se enviaron datos para actualizar"
            });
        }

        const user = await User.findByIdAndUpdate(uid, data, { 
            new: true, 
            runValidators: true 
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            msg: 'Usuario Actualizado',
            user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar usuario',
            error: err.message
        });
    }
};


// CLIENT AND ADMIN ROLE METHODS -------------------------

export const updatePassword = async (req, res) => {
    try{
        const { uid } = req.params
        const { oldPassword } = req.body
        const { newPassword } = req.body

        const user = await User.findById(uid)

        const matchOldAndOldPassword = await verify(user.password, oldPassword)

        if(!matchOldAndOldPassword){
            return res.status(400).json({
                success: false,
                message: "La contraseña ingresada no concuerda con la contraseña actual"
            })
        }

        if (!user.password == oldPassword){
            return res.status(200).json({
                success: true
            })
        }
        
        const matchOldAndNewPassword = await verify(user.password, newPassword)

        if(matchOldAndNewPassword){
            return res.status(400).json({
                success: false,
                message: "La nueva contraseña no puede ser igual a la anterior"
            })
        }

        const encryptedPassword = await hash(newPassword)

        await User.findByIdAndUpdate(uid, {password: encryptedPassword}, {new: true})

        return res.status(200).json({
            success: true,
            message: "Contraseña actualizada",
        })

    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error al actualizar contraseña",
            error: err.message
        })
    }
}

export const deleteUser = async (req, res) => {
    try{
        const { usuario } = req
        
        const user = await User.findByIdAndUpdate(usuario.uid, {status: false}, {new: true})

        return res.status(200).json({
            success: true,
            message: "Usuario eliminado",
            user
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error al eliminar el usuario",
            error: err.message
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const  data  = req.body;

        const user = await User.findByIdAndUpdate(uid, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Usuario Actualizado',
            user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar usuario',
            error: err.message
        });
    }
}

export const updateProfilePicture = async (req, res) => {
    try{
        const { uid } = req.params
        let newProfilePicture = req.file ? req.file.filename : null

        if(!newProfilePicture){
            return res.status(400).json({
                success: false,
                message: "No hay archivo en la petición"
            })
        }

        const user = await User.findById(uid)

        if(user.profilePicture){
            const oldProfilePicture = join(__dirname, "../../public/uploads/profile-pictures", user.profilePicture)
            await fs.unlink(oldProfilePicture)
        }

        user.profilePicture = newProfilePicture
        await user.save()

        return res.status(200).json({
            success: true,
            message: "Foto actualizada",
            profilePicture: user.profilePicture,
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error al actualizar la foto",
            error: err.message
        })
    }
}