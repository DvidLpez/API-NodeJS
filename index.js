'use strict'
// Con este segundo fichero podemos empezar desarrollar la API
// Cargamos en la variable del modulo intalado por consola
// este nos sirve para conectarnos a la bbdd mongo
var mongoose = require('mongoose');

// Cargamos la aplicacion donde previamente se han cargado los modulos
var app = require('./app');

// Definimos el puerto de entrada
var port = process.env.PORT || 2211;

// Realizamos una promesa de conexión
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/concesionario', {useMongoClient: true} )
.then( ()=>{
    console.log('Conexion con MongoDB  OK ...');

    // Escuchamos la peticiones que vengan
    app.listen(port, ()=>{
        console.log('API lista para recibir peticiones ...');
    });
})
.catch(err => console.log(err));
