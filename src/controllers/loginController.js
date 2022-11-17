const { request, response } = require('express');
const axios = require('axios');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { jwt } = require('../helpers/generateJWT');

const login = async(req = request, res = response) => {

    const { username, password } = req.body;
    
    try {

        try {
            /*const resp = await axios.get(`http://localhost:8081/soap/login/${username}/clave/${password}`);
            const user = await User.findOne({ username });*/
            const [resp, userInfo, user] = await Promise.all([
                axios.get(`http://localhost:8081/soap/login/${username}/clave/${password}`),
                axios.get(`http://localhost:8081/soap/datos/aavazquez`),
                User.findOne({ username })
            ]);
            //console.log(userInfo.data.area.value.nombreArea.value);

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
                    category: resp.data.cargo.nombreCargo
                });
                await userNew.save();
                const token = await jwt(userNew.id, userNew.role, userNew.name, userNew.username);

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