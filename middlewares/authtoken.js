'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

var pass = 'Esto no lo sabe nadie ya que solo es para el token';
// con next pasamos a lo siguiente paso de la peticion http
exports.ensureAuth = function(req, res, next){

    if (!req.headers.authorization) {
        return res.status(403).send({Mesaje:'la peticion no tiene la cabecera de atutenticacion'});
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    try{
        var payload = jwt.decode(token, pass);

        if ( payload.exp <= moment().unix() ) {
            return res.status(404).send({Mesaje:'El token ha expirado'});
        }
    }catch(ex){
        return res.status(404).send({Mensaje: "El token no es válido"});
    }

    req.user = payload;
    // al pasar el middleware pasa a la siguiente accion
    next();
}
