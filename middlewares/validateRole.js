const { request, response } = require('express');

const hasAnyRole = (...roles) => {
    return (req = request, res = response, next) => {
        if(!req.authrole){
            return res.status(500).json({
                msg: 'No existe el token para validar'
            });
        }

        if(!roles.includes(req.authrole)){
            return res.status(401).json({
                msg: 'Su rol no tiene los permisos necesarios'
            });
        }

        next();
    }
}

module.exports = { hasAnyRole }