const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { jwt } = require('../helpers/generateJWT');

const login = async(req = request, res = response) => {

    const { username, password } = req.body;
    
    try {

        const user = await User.findOne({ username });
        if(!user){
            return res.status(400).json({
                msg: 'Usuario incorrecto'
            });
        }

        const validPassword = bcryptjs.compareSync(password, user.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Contraseña incorrecta'
            });
        }

        const token = await jwt( user.id, user.role, user.name, user.username );

        res.json(token);
        
    } catch (error) {
        res.status(500).json({
            msg: 'Algo salio mal'
        });
    }
    
    
}

module.exports = {
    login
}