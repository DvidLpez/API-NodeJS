// Definimos el controlador de usuarios,
// Cada controlador require modulos y metodos que seran acciones
'use strict'

// cargamos los modulos
var fs = require('fs');
var path = require('path');


// Cargamos el modelos
var User = require('../models/user');
var Coche = require('../models/coche');




// Definimos los metodos de nuestro Controlador
function pruebas(req, res){
    res.status(200).send({
        Mensaje: "Probando el controlador de coches",
        user: req.user
    });
}

function guardarCoche(req, res){

    // instanciamos el modelo
    var coche = new Coche();
    // recogemos lo que nos llega por parametro
    var params = req.body;

    if (params.fabricante && params.modelo) {

        coche.fabricante = params.fabricante;
        coche.modelo = params.modelo;
        coche.color = params.color;
        coche.image = null;
        coche.user = req.user.sub;

        coche.save(  (err, cocheStored) => {
            if (err) {
                res.status(500).send({ Mensaje: "Error en el servidor" });

            } else {

                if (!cocheStored) {
                    res.status(404).send({ Mensaje: "El coche no se ha guardado" });
                } else {
                    res.status(200).send({ Mensaje: "Coche Guardado correctamente:", coche: cocheStored });


                }
            }

        });
    
    }else{
        res.status(200).send({
            Mensaje: "El fabricante y el modelo es obligatorio"
        });
    }
}

function listarCoches(req, res){
    Coche.find({}).populate({path: 'user'}).exec( (err, coches) =>{

        if (err) {
            res.status(500).send({Mensaje:"Error en la petición"});
        }else{
            if (!coches) {
                res.status(404).send({Mensaje: "No hay coches"});
            }else{
                res.status(200).send({ coches });
            }
        }





    });
}

function verCoche(req, res){
    
    var cocheId = req.params.id;

    Coche.findById(cocheId).populate({path: 'user'}).exec( (err, coche) => {

        if (err) {
            res.status(500).send({ Mensaje: "Error en la petición" });
        } else {
            if (!coche) {
                res.status(404).send({ Mensaje: "No existe el coche" });
            } else {
                res.status(200).send({ coche });
            }
        }


    });
}

function actualizarCoche(req, res){

        var cocheId = req.params.id;
        var update = req.body;

        Coche.findByIdAndUpdate( cocheId, update, {new:true}, (err, cocheActualizado)=>{

            if (err) {
                res.status(500).send({ Mensaje: "Error en la petición" });
            } else {
                if (!cocheActualizado) {
                    res.status(404).send({ Mensaje: "No se ha podido actulizar el coche" });
                } else {
                    res.status(200).send({ cocheActualizado });
                }
            }
        });
}

function uploadImagen(req, res) {
    var cocheId = req.params.id;

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];
        var file_ext = file_name.split('.')[1];

        if (file_ext == 'png' || file_ext == "jpg") {
            

            Coche.findByIdAndUpdate(cocheId, { image: file_name }, { new: true }, (err, cocheUpdate) => {
                if (err) {
                    res.status(500).send({ Mensaje: 'Error al guardar imagen' });
                } else {
                    if (!cocheUpdate) {
                        res.status(404).send({ Mensaje: "No se ha podido guardar el coche" });
                    } else {
                        res.status(200).send({ coche: cocheUpdate, image: file_name });
                    }
                }
            });
        } else {
            fs.unlink(file_path, (err) => {
                if (err) {
                    res.status(200).send({ mensaje: 'No valido fichero no borrado' });
                } else {
                    res.status(200).send({ mensaje: 'Extension no valida' });
                }
            })
        }

    } else {
        res.status(200).send({ mensaje: 'no hay ficheros' });
    }
}

function getImageFile(req, res) {
    // nombre de la imagen
    var imageFile = req.params.imageFile;
    // ruta de la imagen
    var path_file = './uploads/coches/' + imageFile;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({ mensaje: "la imagen no existe" });
        }
    });
}

function borrarCoche(req, res){

    var cocheId = req.params.id;

    Coche.findByIdAndRemove(cocheId, (err, cocheRemove) =>{

            if (err) {
                res.status(500).send({Mensaje:"Error en la petición"});
            }else{

                    if (!cocheRemove) {
                        res.status(404).send({Mensaje:"No se ha encontrado el coche"});
                    }else{
                        res.status(200).send({ coche:cocheRemove})
                    }
            }

    });

}

module.exports = {
    pruebas,
    guardarCoche,
    listarCoches,
    verCoche,
    actualizarCoche,
    uploadImagen,
    getImageFile,
    borrarCoche
};
