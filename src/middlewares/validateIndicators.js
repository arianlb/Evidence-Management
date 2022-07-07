const { request, response } = require('express');

const indicatorsRequest = (req = request, res = response, next) => {
    if (!req.body.indicators || req.body.indicators.length === 0){
        return res.status(400).json({msg: 'No hay indicadores que asignar'});
    }

    next();
}

module.exports = { indicatorsRequest }