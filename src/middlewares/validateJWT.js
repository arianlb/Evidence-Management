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
        const { role, uid, department } = jsonwebtoken.verify(token, process.env.SECRETORPRIVATEKEY);
        req.authrole = role;
        req.authid = uid;
        req.authdepartment = department;
        next();
        
    } catch (error) {
        res.status(401).json({
            msg: 'Token no valido'
        });
    }

}

module.exports = { validateToken }