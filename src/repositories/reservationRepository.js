const pool = require('../config/db');

class ReservationRepository {
    // 1. Obtener todas las funciones disponibles para las películas
    async getAllFunctions() {
        const [rows] = await pool.query(`
            SELECT f.id_funcion, p.titulo AS pelicula, s.nombre AS sala, 
            f.fecha_hora, f.precio, f.asientos_disponibles
            FROM Funcion f
            JOIN Pelicula p ON f.id_pelicula = p.id_pelicula
            JOIN Sala s ON f.id_sala = s.id_sala
        `);
        return rows;
    }

    // 2. Obtener los asientos de una sala según la función
    async getSeatsByFunction(id_funcion) {
        const [rows] = await pool.query(`
            SELECT a.id_asiento, a.fila, a.numero, a.tipo,
            CASE WHEN dc.id_detalle IS NOT NULL THEN 'Ocupado' ELSE 'Disponible' END AS estado
            FROM Asiento a
            JOIN Funcion f ON a.id_sala = f.id_sala
            LEFT JOIN DetalleCompra dc ON dc.id_asiento = a.id_asiento AND dc.id_funcion = f.id_funcion
            WHERE f.id_funcion = ?
        `, [id_funcion]);
        return rows;
    }

    // 3. Registrar la compra y sus detalles (apartar asientos)
    async createPurchase(id_usuario, total, metodo_pago, itemsCompra) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Insertar la cabecera de la compra
            const [purchaseResult] = await connection.query(
                'INSERT INTO Compra (id_usuario, fecha_hora, total, metodo_pago) VALUES (?, NOW(), ?, ?)',
                [id_usuario, total, metodo_pago]
            );
            const id_compra = purchaseResult.insertId;

            // Insertar cada asiento seleccionado en DetalleCompra
            for (let item of itemsCompra) {
                await connection.query(
                    'INSERT INTO DetalleCompra (id_compra, id_funcion, id_asiento, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
                    [id_compra, item.id_funcion, item.id_asiento, item.precio_unitario, item.subtotal]
                );
            }

            await connection.commit();
            connection.release();
            return { success: true, id_compra };
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    }
}

module.exports = new ReservationRepository();