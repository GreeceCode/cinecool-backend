const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/', movieController.listarCartelera);
router.get('/genero/:genero', movieController.buscarPorGenero);
router.get('/:id', movieController.obtenerDetalle);

module.exports = router;