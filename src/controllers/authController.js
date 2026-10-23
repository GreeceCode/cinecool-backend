const userRepository = require('../repositories/userRepository');

async function login(req, res) {
    try {
        const { email, password } = req.body;

        
        if (!email || !password) {
            return res.status(400).json({ message: 'El correo y la contraseña son requeridos.' });
        }

        
        const user = await userRepository.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        
        if (user.password !== password) {
            return res.status(401).json({ message: 'Contraseña incorrecta.' });
        }

        
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
        return res.status(500).json({ 
            message: 'Error interno del servidor', 
            error: error.message 
        });
    }
}

module.exports = {
    login
};