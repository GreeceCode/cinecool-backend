const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/', movieController.listarPeliculas);
router.get('/cartelera', movieController.listarCartelera);
router.get('/genero/:genero', movieController.buscarPorGenero);
router.get('/:id', movieController.obtenerDetalle);

router.post('/', movieController.crearPelicula);
router.put('/:id', movieController.actualizarPelicula);
router.delete('/:id', movieController.eliminarPelicula);

module.exports = router;