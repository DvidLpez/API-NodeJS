// Crear el modelo usuario para conectar a las colecciones de mongo
'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Definimos el esquema de la coleccion;
var CocheSchema = Schema({
    fabricante:String,
    modelo: String,
    color:String,
    image: String,
    user:{ type:Schema.ObjectId, ref:'User'}
});

// exportamos el modulo
module.exports = mongoose.model('Coche', CocheSchema);
