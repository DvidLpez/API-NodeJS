'use strict'
// solicitamos los modulos reuqueridos segun nuestras rutas
var express = require('express');
// Definimos los controladores
var UserController = require('../controllers/user');
// seteamos la variable que serán las rutas con sus metodos de peticion
var api = express.Router();
// seteamos el middleware de autenticacion
var md_auth = require('../middlewares/authtoken');
// setemaos el modulo para la carga de archivos
var multipart = require('connect-multiparty');
// seteamos la direccion de guardado
var md_upload = multipart({ uploadDir: './uploads/users'});


// Definicion de una ruta:
// ** api.metodoHTTP('ruta', middleware, controller.metodo);

// ruta de test
api.get('/test', md_auth.ensureAuth, UserController.pruebas);
// ruta para crear usuarios
api.post('/nuevo-usuario', UserController.registroUser);
// ruta para logearse
api.post('/login', UserController.loginUser);
// Ruta para actualizar usuario
api.put('/update-usuario/:id', md_auth.ensureAuth, UserController.actualizarUser);
// ruta para subir una img de usuario al servidor
api.post('/update-img-usuario/:id', [md_auth.ensureAuth,md_upload], UserController.uploadImagen);
// ruta para recoger una imagen por url
api.get('/get-image-file/:imageFile', md_upload, UserController.getImageFile);


// Exportamos el modulo
module.exports = api;
