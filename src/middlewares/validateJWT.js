const { request, response } = require('express');
const jsonwebtoken = require('jsonwebtoken');

const validateToken = (req = request, res = response, next) => {

    const token = req.header('Authorization');
    if(!token){
        return res.status(401).json({
            msg: 'No hay token en el header'
        });
    }

    try {
        const { role } = jsonwebtoken.verify(token, process.env.SECRETORPRIVATEKEY);
        req.authrole = role;
        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        });
    }

}

module.exports = { validateToken }