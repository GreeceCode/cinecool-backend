const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');

// Registro de Usuario con bcrypt.hash
async function register(req, res) {
    try {
        const { nombre, email, password, rol } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }

        // Verificar si el correo ya está registrado
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        // Hashear la contraseña obligatoriamente con bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Guardar el usuario en la base de datos
        const newUserId = await userRepository.createUser({
            nombre,
            email,
            password: hashedPassword,
            rol
        });

        return res.status(201).json({
            message: '¡Usuario registrado exitosamente!',
            userId: newUserId
        });

    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

// Login de Usuario con bcrypt.compare
async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'El correo y la contraseña son requeridos.' });
        }

        // Buscar el usuario por correo
        const user = await userRepository.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Comparar la contraseña ingresada con la contraseña hasheada
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta.' });
        }

        // Retornar éxito con los datos básicos del usuario
        return res.status(200).json({
            message: '¡Inicio de sesión exitoso!',
            user: {
                id: user.id_usuario,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol
            }
        });

    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

module.exports = {
    register,
    login
};