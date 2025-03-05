import { hash, verify } from "argon2";
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
                message: "Acceso denegado. Se requiere el rol de ADMIN_ROLE"
            });
        }

        const user = await User.findById(uid);
        
        if (user.role === "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                message: "No se puede eliminar un usuario con rol ADMIN_ROLE"
            });
        }

        user.status = false;
        await user.save();

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
    const { usuario } = req;
    const { uid } = req.params;
    const { name, surname, username, email, password, NIT } = req.body;

    if (!usuario || usuario.role !== "ADMIN_ROLE") {
        return res.status(401).json({
            success: false,
            message: "Acceso denegado. Se requiere el rol de ADMIN_ROLE"
        });
    }

    try {
        const user = await User.findById(uid);

        if (user.role === "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                message: "No se puede editar un usuario con rol ADMIN_ROLE"
            });
        }

        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (surname) updatedFields.surname = surname;
        if (username) updatedFields.username = username;
        if (email) updatedFields.email = email;
        if (password) {
            updatedFields.password = await argon2.hash(password);
        }
        if (NIT) updatedFields.NIT = NIT;

        updatedFields.updatedAt = new Date();

        Object.assign(user, updatedFields);
        await user.save();

        return res.status(200).json({
            message: "Usuario actualizado exitosamente.",
            user: {
                name: user.name,
                surname: user.surname,
                username: user.username,
                email: user.email,
                NIT: user.NIT,
            },
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al actualizar el usuario.",
            error: err.message,
        });
    }
};

export const updateRoleAdmin = async (req, res) => {
    try {
        const { usuario } = req;
        const { uid } = req.params;

        if (!usuario || usuario.role !== "ADMIN_ROLE") {
            return res.status(401).json({
                success: false,
                message: "Acceso denegado. Se requiere el rol de ADMIN_ROLE"
            });
        }

        const user = await User.findById(uid);

        user.role = "ADMIN_ROLE";
        await user.save();

        return res.status(200).json({
            success: true,
            message: "El rol del usuario a hizo actualizado a ADMIN_ROLE",
            user
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "No se pudo actualizar el rol del usuario",
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

export const deleteUser = async (req, res) => {
    try{
        const usuario = req.usuario._id;
        
        const user = await User.findByIdAndUpdate(usuario, {status: false}, {new: true})

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
    const id = req.usuario._id;
    const { name, surname, username, email, password, NIT } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (surname) updatedFields.surname = surname;
        if (username) updatedFields.username = username;
        if (email) updatedFields.email = email;
        if (password) {
            updatedFields.password = await argon2.hash(password);
        }
        if (NIT) updatedFields.NIT = NIT;

        updatedFields.updatedAt = new Date();

        Object.assign(user, updatedFields);
        await user.save();

        return res.status(200).json({
            message: "Usuario actualizado exitosamente.",
            user: {
                name: user.name,
                surname: user.surname,
                username: user.username,
                email: user.email,
                NIT: user.NIT,
            },
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al actualizar el usuario.",
            error: err.message,
        });
    }
};