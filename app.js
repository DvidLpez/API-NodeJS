'use strict'
// Primer fichero que se genera con:
// Cargamos en las variables los modulos de nuestra app principal
// * Expres ===== para las rutas
// * Body Parser = para tratar las respuestas de las consultas a la bbdd a json
// * express()  == carga el modulo entero para rutas
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// middlewares de body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


// Acceso cruzado entre dominios para las peticiones ajax (para que todos puedan acceder)
// en nuestro caso accederemos desde Angular 2, 4, 5

// Configurar cabeceras y cors
// En sí es un middleware
app.use( (req, res, next)=>{
    // Configurarcion de las cabeceras necesarias para el acceso ajax desde el frontend

    // cabecera de acceso
    res.header('Access-Control-Allow-Origin', '*');
    // permite las siguientes cabeceras
    res.header('Access-Control-Allow-Headeres, Authorization, X-APY-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    // metodos http permitidos
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    // pasar metodos en claro
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//cargar rutas de la API
var user_routes = require('./routes/user');
var coche_routes = require('./routes/coche');

// rutas base
app.use('/api', user_routes);
app.use('/api', coche_routes);

// Exportamos el modulo APP
module.exports = app;
