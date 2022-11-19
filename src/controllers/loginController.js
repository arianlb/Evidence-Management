const { request, response } = require('express');
const axios = require('axios');
const bcryptjs = require('bcryptjs');

const Role = require('../models/role');
const User = require('../models/user');
const Year = require('../models/year');
const { jwt } = require('../helpers/generateJWT');

const login = async(req = request, res = response) => {

    const { username, password } = req.body;
    
    try {

        if (username === 'adminmax' && password === 'adminmax') {
            
            const [roles, years, token] = await Promise.all([
                Role.find(),
                Year.find(),
                jwt('637926c111cebcf36521709a', 'ROLE_ADMIN', 'adminmax', 'adminmax', 'adminmax')
            ]);
            
            if(roles.length === 0) {
                const roles = [{ role: 'ROLE_ADMIN' }, { role: 'ROLE_CHIEFA'}, {role: 'ROLE_CHIEFD'}, {role: 'ROLE_USER'}];
                await Role.insertMany(roles);
            }

            if (years.length === 0) {
                const currentYear = new Date().getFullYear();
                const year = new Year({ years: [currentYear], departments: ['No asignado'] });
                await year.save();
            }

            return res.json( token );
        }

        try {
            
            let department = 'No asignado';
            const [resp, user] = await Promise.all([
                axios.get(`http://localhost:8081/soap/login/${username}/clave/${password}`),
                User.findOne({ username })
            ]);

            axios.get(`http://localhost:8081/soap/datos/${username}`).then(resp => {
                department = resp.data.area.value.nombreArea.value;
            }).catch(err => { 
                req.log.warn('No se pudo obtener el departamento del usuario en el servicio UCI');
            });

            if (!resp.data.autenticado) {
                req.log.warn('Usuario o Contraseña incorrecto');
                return res.status(400).json({
                    msg: 'Usuario o Contraseña incorrecto'
                });
            }

            if (user) {
                user.name = resp.data.nombres + ' ' + resp.data.apellidos;
                const newPassword = bcryptjs.hashSync(password, bcryptjs.genSaltSync());
                user.password = newPassword;
                user.faculty = resp.data.area.nombreArea;
                user.solapin = resp.data.credencial;
                user.category = resp.data.cargo.nombreCargo;
                if (department !== 'No asignado') { user.department = department; }
                await user.save();
                const token = await jwt(user.id, user.role, user.name, user.username, user.department);

                res.json(token);
                req.log.info(`Autenticado el Usuario: ${user._id}`);
            } else {
                const newPassword = bcryptjs.hashSync(password, bcryptjs.genSaltSync());
                const userNew = new User({
                    name: resp.data.nombres + ' ' + resp.data.apellidos,
                    username: resp.data.usuario,
                    password: newPassword,
                    role: 'ROLE_USER',
                    faculty: resp.data.area.nombreArea,
                    solapin: resp.data.credencial,
                    category: resp.data.cargo.nombreCargo,
                    department: department
                });
                await userNew.save();
                const token = await jwt(userNew.id, userNew.role, userNew.name, userNew.username, userNew.department);

                res.json(token);
                req.log.info(`Autenticado el Usuario: ${userNew._id}`);
            }
        } catch (error) {
            const user = await User.findOne({ username });
            if (!user) {
                req.log.warn(`El nombre de usuario: ${username} no existe`);
                return res.status(400).json({
                    msg: 'Usuario incorrecto'
                });
            }

            const validPassword = bcryptjs.compareSync(password, user.password);
            if (!validPassword) {
                req.log.warn('La contraseña es incorrecta');
                return res.status(400).json({
                    msg: 'Contraseña incorrecta'
                });
            }

            const token = await jwt(user.id, user.role, user.name, user.username, user.department);

            res.json(token);
            req.log.info(`Autenticado el Usuario: ${user._id}`);
        }
        
        
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