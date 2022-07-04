const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { jwt } = require('../helpers/generateJWT');

const login = async(req = request, res = response) => {

    const { username, password } = req.body;
    
    try {

        const user = await User.findOne({ username });
        if(!user){
            req.log.warn(`El nombre de usuario: ${username} no existe`);
            return res.status(400).json({
                msg: 'Usuario incorrecto'
            });
        }

        const validPassword = bcryptjs.compareSync(password, user.password);
        if(!validPassword){
            req.log.warn('Invalid password provided');
            return res.status(400).json({
                msg: 'Contraseña incorrecta'
            });
        }

        const token = await jwt( user.id, user.role, user.name, user.username );

        res.json(token);
        req.log.info(`Autenticado el Usuario: ${user._id}`)
        
    } catch (error) {
        res.status(500).json({
            msg: error.message
        });
        req.log.error(error.message);
    }
    
    
}

module.exports = {
    login
}