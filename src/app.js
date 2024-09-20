const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { config } = require('dotenv');

config();

const bookRoutes = require('./routes/book.routes');

const app = express();
app.use(bodyParser.json())

// CONEXIÓN A LA BASE DE DATOS
mongoose.connect(process.env.MONGO_URL, {
    dbName: process.env.DB_NAME
})
const db = mongoose.connection;

app.use('/books', bookRoutes);


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Servidor corriendo en el puerto ", port)
})
