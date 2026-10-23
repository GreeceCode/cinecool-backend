const pool = require('../config/db');

const getCartelera = async (genero = null) => {
  let sql = `
    SELECT p.id_pelicula, p.titulo, p.genero, p.duracion, p.clasificacion, p.fecha_estreno,
           MIN(f.fecha_hora) AS proxima_funcion,
           MIN(f.precio)     AS precio_desde
    FROM Pelicula p
    INNER JOIN Funcion f ON f.id_pelicula = p.id_pelicula
    WHERE f.fecha_hora >= NOW()
  `;
  const params = [];

  if (genero) {
    sql += ' AND p.genero = ?';
    params.push(genero);
  }

  sql += ' GROUP BY p.id_pelicula ORDER BY p.titulo ASC';

  const [rows] = await pool.query(sql, params);
  return rows;
};

const getByGenero = async (genero) => {
  const [rows] = await pool.query(
    'SELECT * FROM Pelicula WHERE genero = ? ORDER BY titulo ASC',
    [genero]
  );
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM Pelicula WHERE id_pelicula = ?',
    [id]
  );
  return rows[0] || null;
};

const getFuncionesByPelicula = async (id) => {
  const [rows] = await pool.query(
    `SELECT f.id_funcion, f.fecha_hora, f.precio, f.asientos_disponibles,
            s.id_sala, s.nombre AS sala, s.tipo AS tipo_sala
     FROM Funcion f
     INNER JOIN Sala s ON s.id_sala = f.id_sala
     WHERE f.id_pelicula = ? AND f.fecha_hora >= NOW()
     ORDER BY f.fecha_hora ASC`,
    [id]
  );
  return rows;
};

module.exports = {
  getCartelera,
  getByGenero,
  getById,
  getFuncionesByPelicula,
};