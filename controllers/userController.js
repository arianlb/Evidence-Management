const { request, response} = require('express');
const bcryptjs = require('bcryptjs');

const { deleteUser } = require('../helpers/removeModels');
const User = require('../models/user');

const userGet = async(req = request, res = response) => {
    
    try {
        const { begin = 0, amount = 5} = req.query;
    
        const [ total, users ] = await Promise.all([
            User.countDocuments(),
            User.find({status: true}).skip(Number(begin)).limit(Number(amount))
        ]);
    
        res.json({
            total,
            users
        });
        req.log.info('Obtuvo todos los Usuarios');
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const userPost = async(req = request, res = response) => {

    try {
        const { name, username, password, role, faculty, department, category } = req.body;
        const user = new User({ name, username, password, role, faculty, department, category});
    
        //Encripta la contraseña | bcryptjs.genSaltSync() -> nivel de encriptacion
        user.password = bcryptjs.hashSync(password, bcryptjs.genSaltSync());
    
        //guarda en BD
        await user.save();
    
        res.json(user);
        req.log.info('Creo el Usuario: '+ username);
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const userPut = async(req = request, res = response) => {
    try {
        const { id } = req.params;
        const { _id, password, ...rest } = req.body;
    
        if(password){
            rest.password = bcryptjs.hashSync(password, bcryptjs.genSaltSync());
        }
    
        await User.findByIdAndUpdate(id, rest);
        
        res.json({
            msg: 'Usuario actualizado',
        });
        req.log.info('Actualizo el Usuario: '+ id);
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const userDelete = async(req = request, res = response) => {
    try {
        await deleteUser(req.params.id);
        res.json({msg: 'Usuario desactivado'});
        req.log.info('Desactivo el Usuario: '+ req.params.id);
    } catch (error) {
        res.status(500).json({msg: error.message});
        req.log.error(error.message);
    }
}

module.exports = {userGet, userPost, userPut, userDelete}