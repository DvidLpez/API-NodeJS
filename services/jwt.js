'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

var clave = 'Esto no lo sabe nadie ya que solo es para el token';

exports.createToken = function(user){

    var userJWT = {
        sub: user._id,
        nombre: user.mombre,
        apellidos: user.apellidos,
        role:user.role,
        email: user.email,
        iat: moment().unix,
        exp:moment().add(30, 'days').unix
    }

    return jwt.encode(userJWT, clave);
};
