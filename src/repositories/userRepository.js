const pool = require('../config/db');

// Buscar usuario por correo electrónico (para el login)
async function findByEmail(email) {
    try {
        const [rows] = await pool.query('SELECT * FROM Usuario WHERE email = ?', [email]);
        return rows[0];
    } catch (error) {
        throw new Error('Error al consultar la base de datos: ' + error.message);
    }
}


async function createUser(user) {
    try {
        const { nombre, email, password, rol } = user;
        const [result] = await pool.query(
            'INSERT INTO Usuario (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
            [nombre, email, password, rol || 'cliente']
        );
        return result.insertId;
    } catch (error) {
        throw new Error('Error al insertar el usuario: ' + error.message);
    }
}

module.exports = {
    findByEmail,
    createUser
};