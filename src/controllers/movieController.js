const movieRepository = require('../repositories/movieRepository');

const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const validarPelicula = (body = {}) => {
  const { titulo, genero, duracion, clasificacion, fecha_estreno } = body;

  if (!titulo || !genero || duracion === undefined || !clasificacion || !fecha_estreno) {
    return { error: 'Faltan campos obligatorios: titulo, genero, duracion, clasificacion, fecha_estreno' };
  }

  const data = {
    titulo: String(titulo).trim(),
    genero: String(genero).trim(),
    duracion: Number(duracion),
    clasificacion: String(clasificacion).trim(),
    fecha_estreno: String(fecha_estreno).trim(),
  };

  if (!data.titulo || data.titulo.length > 150) {
    return { error: 'El título es obligatorio y debe tener máximo 150 caracteres' };
  }
  if (!data.genero || data.genero.length > 50) {
    return { error: 'El género es obligatorio y debe tener máximo 50 caracteres' };
  }
  if (!Number.isInteger(data.duracion) || data.duracion <= 0) {
    return { error: 'La duración debe ser un número entero mayor a 0 (en minutos)' };
  }
  if (!data.clasificacion || data.clasificacion.length > 20) {
    return { error: 'La clasificación es obligatoria y debe tener máximo 20 caracteres' };
  }
  if (!FECHA_REGEX.test(data.fecha_estreno) || Number.isNaN(Date.parse(data.fecha_estreno))) {
    return { error: 'La fecha de estreno debe tener el formato YYYY-MM-DD' };
  }

  return { data };
};

const validarId = (valor) => {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const listarPeliculas = async (req, res) => {
  try {
    const movies = await movieRepository.getAll(req.query.genero || null);
    res.json(movies);
  } catch (error) {
    console.error('Error al listar películas:', error);
    res.status(500).json({ message: 'Error al obtener las películas' });
  }
};

const listarCartelera = async (req, res) => {
  try {
    const movies = await movieRepository.getCartelera(req.query.genero || null);
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
    const id = validarId(req.params.id);
    if (!id) return res.status(400).json({ message: 'ID inválido' });

    const movie = await movieRepository.getById(id);
    if (!movie) return res.status(404).json({ message: 'Película no encontrada' });

    const funciones = await movieRepository.getFuncionesByPelicula(id);
    res.json({ ...movie, funciones });
  } catch (error) {
    console.error('Error al obtener detalle:', error);
    res.status(500).json({ message: 'Error al obtener el detalle de la película' });
  }
};

const crearPelicula = async (req, res) => {
  try {
    const { data, error } = validarPelicula(req.body);
    if (error) return res.status(400).json({ message: error });

    const id = await movieRepository.create(data);
    const nueva = await movieRepository.getById(id);
    res.status(201).json(nueva);
  } catch (error) {
    console.error('Error al crear película:', error);
    res.status(500).json({ message: 'Error al registrar la película' });
  }
};

const actualizarPelicula = async (req, res) => {
  try {
    const id = validarId(req.params.id);
    if (!id) return res.status(400).json({ message: 'ID inválido' });

    const { data, error } = validarPelicula(req.body);
    if (error) return res.status(400).json({ message: error });

    const existe = await movieRepository.getById(id);
    if (!existe) return res.status(404).json({ message: 'Película no encontrada' });

    await movieRepository.update(id, data);
    const actualizada = await movieRepository.getById(id);
    res.json(actualizada);
  } catch (error) {
    console.error('Error al actualizar película:', error);
    res.status(500).json({ message: 'Error al actualizar la película' });
  }
};

const eliminarPelicula = async (req, res) => {
  try {
    const id = validarId(req.params.id);
    if (!id) return res.status(400).json({ message: 'ID inválido' });

    const existe = await movieRepository.getById(id);
    if (!existe) return res.status(404).json({ message: 'Película no encontrada' });

    await movieRepository.remove(id);
    res.json({ message: 'Película eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar película:', error);
    res.status(500).json({ message: 'Error al eliminar la película' });
  }
};

module.exports = {
  listarPeliculas,
  listarCartelera,
  buscarPorGenero,
  obtenerDetalle,
  crearPelicula,
  actualizarPelicula,
  eliminarPelicula,
};