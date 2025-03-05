# proyecto-final-taller
Repositorio del proyecto final de taller

OBSERVACIONES:

- AUTH:
  /Register: todos los usuarios seran asignados con el CLEINT_ROLE
  /Login: todo usuario registrado se puede loguear

- USER:
  ADMIN_ROLE:
    /: Se envia por token un usuario con rol ADMIN_ROLE
    /findUser/:uid : Se envia por token un usuario con rol ADMIN_ROLE, en la URL enviar el usuario que deseas ver
    /deleteClient/:uid : Se envia por token un usuario con rol ADMIN_ROLE, en la URL enviar el usuario que deseas eliminar, solo deja eliminar usuarios de CLIENT_ROLE
    /updateClient/:uid : Se envia por token un usuario con rol ADMIN_ROLE, en la URL enviar el usuario que deseas editar, solo deja editar usuarios de CLIENT_ROLE
    /updateRoleAdmin/:uid : Se envia por token un usuario con rol ADMIN_ROLE, en la URL enviar el usuario que deseas cambiiar su rol a ADMIN_ROLE
  CLIENT AND ADMIN ROLE
    /updatePassword/:uid : Se envia por la URL el usuario que quiere actualizar su contraseña
    /updateProfilePicture/:uid : Se envia por la URL el usuario que quiere actualizar su foto de perfil
    /deleteUser : Se envia por el token el usuario que quiere eliminarse
    /updateUser : Se envia por el token el usuario que quiere actualizarse

- Category:
  A estas rutas solo puede acceder los usuarios con role ADMIN_ROLE, el usuario se envia mediante el token

- Product:
  A estas rutas solo puede acceder los usuarios con role ADMIN_ROLE, el usuario se envia mediante el token

- Cart:
  A estas rutas solo puede acceder los usuarios con role ADMIN_ROLE y CLIENT_ROLE, el usuario se envia mediante el token

- Invoice:
  A estas rutas solo puede acceder los usuarios con role ADMIN_ROLE y CLIENT_ROL, el usuario se envia mediante el token

USUARIOS Y CONTRASEÑAS:


  SUPER ADMIN:
    "email": "superadmin@gmail.com",
    "password": "Admin123-"

    
  USER CLIENT:
    "email": "cluna-2023308@kinal.edu.gt",
    "password": "Messi10-"
