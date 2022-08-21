const { request, response} = require('express');
const bcryptjs = require('bcryptjs');

const { deleteUser } = require('../helpers/removeModels');
const User = require('../models/user');

const userGet = async(req = request, res = response) => {
    
    try {
        const { begin = 0, amount } = req.query;

        if(amount) {
            
            const [ total, users ] = await Promise.all([
                User.countDocuments(),
                User.find({status: true}).skip(Number(begin)).limit(Number(amount))
            ]);
        
            res.json({
                total,
                users
            });
            req.log.info(`Obtuvo los Usuarios desde ${begin} hasta ${amount}`);

        } else {
            const users = await User.find({status: true});
            res.json({users});
            req.log.info('Obtuvo todos los Usuarios');
        }
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const userEvaluationGet = async (req = request, res = response) => { 
    try {
        const user = await User.findById(req.params.id).populate('indicators');
        if (!user) {
            req.log.warn(`El Usuario: ${req.params.id} no existe en la BD para asociarle indicadores`);
            return res.status(404).json({
                msg: 'No existe el Usuario en la base de datos'
            });
        }
        let indicators = [];
        user.indicators.forEach(indicator => { 
            if(indicator.status) {
                indicators.push(indicator);
            }
        });

        res.json({ user, indicators });
        req.log.info('Obtuvo la evaluacion del Usuario: ' + req.params.id);
        
    } catch (error) {
        res.status(500).json({msg: error.message});
        req.log.error(error.message);
    }
}

const userNotificationsGet = async (req = request, res = response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            req.log.warn(`El Usuario: ${req.params.id} no existe en la BD para asociarle indicadores`);
            return res.status(404).json({
                msg: 'No existe el Usuario en la base de datos'
            });
        }

        res.json(user.notifications);
        req.log.info('Obtuvo las notificaciones del Usuario: ' + req.params.id);

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
    
        const user = await User.findByIdAndUpdate(id, rest, {returnDocument: 'after'});
        
        res.json(user);
        req.log.info('Actualizo el Usuario: '+ id);
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const userDelete = async(req = request, res = response) => {
    try {
        await deleteUser(req.params.id);
        res.json({id: req.params.id});
        req.log.info('Desactivo el Usuario: '+ req.params.id);
    } catch (error) {
        res.status(500).json({msg: error.message});
        req.log.error(error.message);
    }
}

module.exports = { userGet, userEvaluationGet, userNotificationsGet, userPost, userPut, userDelete}