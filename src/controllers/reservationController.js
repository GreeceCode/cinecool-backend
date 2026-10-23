const reservationRepository = require('../repositories/reservationRepository');

class ReservationController {
    async getFunctions(req, res) {
        try {
            const functions = await reservationRepository.getAllFunctions();
            res.json(functions);
        } catch (error) {
            console.log("🔥 ERROR REAL DE MYSQL:", error.message); // <--- Agrega esto
            res.status(500).json({ error: 'Error al obtener las funciones', detalle: error.message });
        }
    }
    async getSeats(req, res) {
        try {
            const { id_funcion } = req.params;
            const seats = await reservationRepository.getSeatsByFunction(id_funcion);
            res.json(seats);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los asientos' });
        }
    }

    async makeReservation(req, res) {
        try {
            const { id_usuario, total, metodo_pago, itemsCompra } = req.body;
            const result = await reservationRepository.createPurchase(id_usuario, total, metodo_pago, itemsCompra);
            res.status(201).json({ message: '¡Compra y reserva de asientos exitosa!', ...result });
        } catch (error) {
            res.status(500).json({ error: 'Error al procesar la reserva', details: error.message });
        }
    }
}

module.exports = new ReservationController();