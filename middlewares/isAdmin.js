'use strict';

exports.isAdmin = function(req, res, next){

    if (req.user.role != 'ROLE_ADMIN') {
        res.status(200).send({Mensaje:"no tienes acceso a esta zona"});
    }

    next();
}