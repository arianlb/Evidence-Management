const { request, response} = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const userGet = async(req = request, res = response) => {
    
    const { begin = 0, amount = 5} = req.query;

    const [ total, users ] = await Promise.all([
        User.countDocuments(),
        User.find().skip(Number(begin)).limit(Number(amount))
    ]);

    res.json({
        total,
        users
    });
}

const userPost = async(req = request, res = response) => {

    const { name, username, password, role} = req.body;
    const user = new User({ name, username, password, role});

    //Encripta la contraseña | bcryptjs.genSaltSync() -> nivel de encriptacion
    user.password = bcryptjs.hashSync(password, bcryptjs.genSaltSync());

    //guarda en BD
    await user.save();

    res.json(user);
}

const userPut = async(req = request, res = response) => {
    const { id } = req.params;
    const { _id, password, ...rest } = req.body;

    if(password){
        rest.password = bcryptjs.hashSync(password, bcryptjs.genSaltSync());
    }

    await User.findByIdAndUpdate(id, rest);
    
    res.json({
        msg: 'Usuario actualizado',
    });
}

const userDelete = async(req = request, res = response) => {
    const { id } = req.params;
    //const user = await User.findByIdAndDelete(id);
    const authrole = req.authrole;
    res.json({id, authrole});
}

module.exports = {userGet, userPost, userPut, userDelete}