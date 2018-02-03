'use strict'
// solicitamos los modulos reuqueridos segun nuestras rutas
var express = require('express');
// Definimos los controladores
var CocheController = require('../controllers/coche');
// seteamos la variable que serán las rutas con sus metodos de peticion
var api = express.Router();
// seteamos el middleware de autenticacion
var md_auth = require('../middlewares/authtoken');
// seteamos el middleware de ver si un usuario es administrador
var md_admin = require('../middlewares/isAdmin');
// setemaos el modulo para la carga de archivos
var multipart = require('connect-multiparty');
// seteamos la direccion de guardado
var md_upload = multipart({ uploadDir: './uploads/coches'});


// Definicion de una ruta:
// ** api.metodoHTTP('ruta', middleware, controller.metodo);
// ruta de test
api.get('/pruebas-coche', md_auth.ensureAuth, CocheController.pruebas);

api.get('/ver-coche/:id', CocheController.verCoche);
api.post('/guardar-coche', [md_auth.ensureAuth, md_admin.isAdmin], CocheController.guardarCoche);
api.put('/ver-coche/:id', [md_auth.ensureAuth, md_admin.isAdmin], CocheController.actualizarCoche);
api.delete('/ver-coche/:id', [md_auth.ensureAuth, md_admin.isAdmin], CocheController.borrarCoche);

api.post('/update-img-coche/:id', [ md_auth.ensureAuth, md_upload, md_admin.isAdmin ], CocheController.uploadImagen);
api.get('/get-image-coche/:imageFile', CocheController.getImageFile);

api.get('/listar-coches', CocheController.listarCoches);


// Exportamos el modulo
module.exports = api;


// FALTA ACABAR LA SUBIDA DE IMAGENES DE LOS COCHES