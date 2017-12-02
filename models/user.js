// Crear el modelo usuario para conectar a las colecciones de mongo
'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Definimos el esquema de la coleccion;
var UserSchema = Schema({
    nombre:String,
    apellidos: String,
    email: String,
    image: String,
    role: String,
    password:String
});

// exportamos el modulo
module.exports = mongoose.model('User', UserSchema);
