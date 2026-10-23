const movieRepository = require('../repositories/movieRepository');

const listarCartelera = async (req, res) => {
  try {
    const { genero } = req.query;
    const movies = await movieRepository.getCartelera(genero || null);
    res.json(movies);
  } catch (error) {
    console.error('Error al listar cartelera:', error);
    res.status(500).json({ message: 'Error al obtener la cartelera' });
  }
};

const buscarPorGenero = async (req, res) => {
  try {
    const movies = await movieRepository.getByGenero(req.params.genero);
    if (movies.length === 0) {
      return res.status(404).json({ message: 'No hay películas para ese género' });
    }
    res.json(movies);
  } catch (error) {
    console.error('Error al buscar por género:', error);
    res.status(500).json({ message: 'Error al buscar películas por género' });
  }
};

const obtenerDetalle = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const movie = await movieRepository.getById(id);
    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }

    const funciones = await movieRepository.getFuncionesByPelicula(id);
    res.json({ ...movie, funciones });
  } catch (error) {
    console.error('Error al obtener detalle:', error);
    res.status(500).json({ message: 'Error al obtener el detalle de la película' });
  }
};

module.exports = { listarCartelera, buscarPorGenero, obtenerDetalle };