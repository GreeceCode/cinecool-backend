const pool = require('../config/db');


async function findByEmail(email) {
    try {
        const [rows] = await pool.query('SELECT * FROM Usuario WHERE email = ?', [email]);
        return rows[0]; // Devuelve el primer usuario que encuentre
    } catch (error) {
        throw new Error('Error al consultar la base de datos: ' + error.message);
    }
}

module.exports = {
    findByEmail
};