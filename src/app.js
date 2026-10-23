const express = require('express');
const cors = require('cors');
require('dotenv').config();


const authRouter = require('./routers/authRouter');

const app = express();

app.use(cors());
app.use(express.json());
const movieRoutes = require('./routes/movieRoutes');
app.use('/api/movies', movieRoutes);


app.use('/api/auth', authRouter);

PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.json({ message: '¡API de CineCool funcionando correctamente con el Patrón de Repositorio!' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

const reservationRoutes = require('./routes/reservationRoutes');
app.use('/api/reservations', reservationRoutes);