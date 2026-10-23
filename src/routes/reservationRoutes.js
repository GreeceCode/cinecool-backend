const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.get('/functions', reservationController.getFunctions);
router.get('/seats/:id_funcion', reservationController.getSeats);
router.post('/checkout', reservationController.makeReservation);

module.exports = router;