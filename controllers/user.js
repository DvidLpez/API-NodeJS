// Definimos el controlador de usuarios,
// Cada controlador require modulos y metodos que seran acciones
'use strict'
// cargamos los modulos
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');
// Cargamos el modelos
var User = require('../models/user');
//Servicios jwt
var jwt = require('../services/jwt');


// Definimos los metodos de nuestro Controlador
function pruebas(req, res){
    res.status(200).send({
        Mensaje: "Probando el controlador de prueba"
    });
}

function registroUser(req, res){
    // Crear el schema marca
    var user = new User();

    // Recoger parámetros petición
    var params = req.body;
    // Asignar valores al usuario se pueden validar pero no es el caso
    if (params.nombre && params.apellidos && params.email && params.password) {

        user.nombre = params.nombre;
        user.apellidos = params.apellidos;
        user.image = params.image;
        user.email = params.email.toLowerCase();
        user.role = "ROLE_USER";
        user.password = params.password;

        User.findOne({email: user.email}, (err, data) => {
            if (err) {
                res.status(500).send({Mensaje:'Error al comprobar el usuario'});
            }else{
                if (!data) {
                    // cifrar el password
                    bcrypt.hash(user.password, null, null, function(err, hash){
                        user.password = hash;
                        user.save( (error, userStored)=>{
                            if (err) {
                                res.status(500).send({Mensaje:'Error al guardar el usuario'});
                            }else{
                                if (!userStored) {
                                    res.status(404).send({Mensaje:'No se ha podido guardar usuario'});
                                }else{
                                    res.status(200).send({user: userStored});
                                }
                            }
                        })
                    });
                }else{
                    res.status(200).send({Mensaje:'El usuario ya existe.....'});
                }
            }
        });
    }else{
        res.status(200).send({ Mensaje:'Introduce todos los datos...'});
    }
}

function loginUser(req, res){

    var params = req.body;

    var email = params.email;
    var pass = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user)=>{
        if (err) {
            res.status(500).send({Mensaje: 'Error al comprobar el nombre'});
        } else {
            if (user) {
                // console.log(user);
                bcrypt.compare(pass, user.password, (err, check)=>{
                    if (check) {

                        // comprobar el token
                        if (params.gettoken) {
                            // devolver el token
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });

                        } else {
                            res.status(200).send({user,});
                        }

                    } else {
                        res.status(404).send({Mensaje: 'El usuario no se puede logear'});
                    }
                });
            } else {
                res.status(404).send({Mensaje: 'El usuario no ha podido logearse'});
            }
        }
    });
}

function actualizarUser(req, res){

    var userId = req.params.id;
    var update = req.body;

    if (userId != req.user.sub) {
        return res.status(500).send({Mensaje: 'no tienes permisos'});
    }

    User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdate) =>{
        if (err) {
            res.status(500).send({Mensaje: 'Error al actualizar'});
        }else{
            if (!userUpdate) {
                res.status(404).send({Mensaje: "No se ha podido actualizar"});
            }else{
                res.status(200).send({user: userUpdate});
            }
        }
    });
}

function uploadImagen(req, res){
    var userId = req.params.id;

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];
        var file_ext = file_name.split('.')[1];

        if (file_ext =='png' || file_ext == "jpg") {
            if (userId != req.user.sub) {
                return res.status(500).send({Mensaje: 'no tienes permisos'});
            }

            User.findByIdAndUpdate(userId, {image: file_name}, {new:true}, (err, userUpdate) =>{
                if (err) {
                    res.status(500).send({Mensaje: 'Error al guardar imagen'});
                }else{
                    if (!userUpdate) {
                        res.status(404).send({Mensaje: "No se ha podido guardar"});
                    }else{
                        res.status(200).send({user: userUpdate, image: file_name});
                    }
                }
            });
        }else{
            fs.unlink(file_path, (err)=>{
                if (err) {
                    res.status(200).send({mensaje: 'No valido fichero no borrado'});
                } else {
                    res.status(200).send({mensaje: 'Extension no valida'});
                }
            })
        }

    }else{
        res.status(200).send({mensaje: 'no hay ficheros'});
    }
}

function getImageFile(req,res){
    // nombre de la imagen
    var imageFile = req.params.imageFile;
    // ruta de la imagen
    var path_file = './uploads/users/' + imageFile;

    fs.exists(path_file, (exists)=>{
        if (exists) {
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({mensaje:"la imagen no existe"});
        }
    });
}

function getUsers(req, res){

    User.find({role: 'ROLE_USER'}).exec( (err, users)=>{
        if (err) {
            res.status(500).send({mensaje: 'Error en la petición'});
        }else{
            if (!users) {
                res.status(404).send({mensaje: 'No hay usuarios en nuestra API'});
            }else{
                res.status(200).send({users});
            }
        }
    });
}

// Exportamos los metodos del controlador
module.exports = {
    pruebas,
    registroUser,
    loginUser,
    actualizarUser,
    uploadImagen,
    getImageFile,
    getUsers
};
