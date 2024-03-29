const { request, response} = require('express');
const bcryptjs = require('bcryptjs');

const Area = require('../models/area');
const User = require('../models/user');
const { deleteUser } = require('../helpers/removeModels');
const { personalIndicators } = require('../helpers/indicatorResponse');

const changePassword = async (req = request, res = response) => {
    try {
        const { oldpassword, newpassword } = req.body;
        const user = await User.findById(req.authid);
        if (!user) {
            req.log.warn(`El Usuario: ${req.authid} no existe en la BD para asociarle indicadores`);
            return res.status(404).json({
                msg: 'No existe el Usuario en la base de datos'
            });
        }

        const validPassword = bcryptjs.compareSync(oldpassword, user.password);
        if (!validPassword) {
            req.log.warn('La contraseña es incorrecta');
            return res.status(400).json({
                msg: 'Contraseña incorrecta'
            });
        }

        const password = bcryptjs.hashSync(newpassword, bcryptjs.genSaltSync());
        await User.findByIdAndUpdate(req.authid, { password });
        res.json({ msg: 'Contraseña actualizada' });
        req.log.info('Actualizo la contraseña del Usuario: ' + req.authid);
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const userGet = async (req = request, res = response) => {
    
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
            
            if (req.authrole === 'ROLE_ADMIN') {
                const users = await User.find();
                req.log.info('Obtuvo los Usuarios');
                return res.json({ users });
            }

            if (req.authrole === 'ROLE_CHIEFD') {
                const users = await User.find({status: true, department: req.authdepartment});
                res.json({users});
                req.log.info('Obtuvo todos los Usuarios del departamento: ' + req.authdepartment);
            } else { 
                const users = await User.find({status: true});
                res.json({ users });
                req.log.info('Obtuvo todos los Usuarios');
            }
        }
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const userEvaluationGet = async (req = request, res = response) => { 
    try {
        const year = req.query.year || new Date().getFullYear();
        const user = await User.findById(req.params.id).populate({
            path: 'indicators',
            match: { year }
        }).populate({
            path: 'evaluations',
            match: { year }
        });
        
        if (!user) {
            req.log.warn(`El Usuario: ${req.params.id} no existe en la BD para asociarle indicadores`);
            return res.status(404).json({
                msg: 'No existe el Usuario en la base de datos'
            });
        }
        const indicators = personalIndicators(req.body.categories, user.indicators, user.evaluations);

        if (user.evaluations.length > 0) {
            res.json({ user, indicators, value: user.evaluations[0].total });
        } else {
            res.json({ user, indicators });
        }
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
        const { name, username, role, faculty, department, solapin, category, areaId } = req.body;
        
        //Encripta la contraseña | bcryptjs.genSaltSync() -> nivel de encriptacion
        const password = bcryptjs.hashSync('facultad4', bcryptjs.genSaltSync());
        
        const user = new User({ name, username, password, role, faculty, department, solapin, category });
    
        //guarda en BD
        await user.save();

        if (areaId) {
            const area = await Area.findById(areaId);
            area.users.push(user._id);
            await area.save();
        }
    
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
        const { _id, password, resetpassword, areaId, ...rest } = req.body;
    
        if(resetpassword){
            rest.password = bcryptjs.hashSync('facultad4', bcryptjs.genSaltSync());
        }

        if (areaId) {
            const area = await Area.findById(areaId);
            area.users.push(id);
            await area.save();
        }
    
        const user = await User.findByIdAndUpdate(id, rest, { returnDocument: 'after' });
        
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

module.exports = { changePassword, userGet, userEvaluationGet, userNotificationsGet, userPost, userPut, userDelete}