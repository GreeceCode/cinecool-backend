const pool = require('../config/db');

const COLUMNAS = `p.id_pelicula, p.titulo, p.genero, p.duracion, p.clasificacion,
                  DATE_FORMAT(p.fecha_estreno, '%Y-%m-%d') AS fecha_estreno`;

const getAll = async (genero = null) => {
  let sql = `SELECT ${COLUMNAS} FROM Pelicula p`;
  const params = [];

  if (genero) {
    sql += ' WHERE p.genero = ?';
    params.push(genero);
  }

  sql += ' ORDER BY p.titulo ASC';
  const [rows] = await pool.query(sql, params);
  return rows;
};

const getCartelera = async (genero = null) => {
  let sql = `
    SELECT ${COLUMNAS},
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

const getByGenero = async (genero) => getAll(genero);

const getById = async (id) => {
  const [rows] = await pool.query(
    `SELECT ${COLUMNAS} FROM Pelicula p WHERE p.id_pelicula = ?`,
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

const create = async ({ titulo, genero, duracion, clasificacion, fecha_estreno }) => {
  const [result] = await pool.query(
    `INSERT INTO Pelicula (titulo, genero, duracion, clasificacion, fecha_estreno)
     VALUES (?, ?, ?, ?, ?)`,
    [titulo, genero, duracion, clasificacion, fecha_estreno]
  );
  return result.insertId;
};

const update = async (id, { titulo, genero, duracion, clasificacion, fecha_estreno }) => {
  const [result] = await pool.query(
    `UPDATE Pelicula
     SET titulo = ?, genero = ?, duracion = ?, clasificacion = ?, fecha_estreno = ?
     WHERE id_pelicula = ?`,
    [titulo, genero, duracion, clasificacion, fecha_estreno, id]
  );
  return result.affectedRows;
};

const remove = async (id) => {
  const [result] = await pool.query(
    'DELETE FROM Pelicula WHERE id_pelicula = ?',
    [id]
  );
  return result.affectedRows;
};

module.exports = {
  getAll,
  getCartelera,
  getByGenero,
  getById,
  getFuncionesByPelicula,
  create,
  update,
  remove,
};