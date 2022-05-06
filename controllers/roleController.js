const { request, response} = require('express');

const Role = require('../models/role');

const roleGet = (req = request, res = response) => {
    res.json({
        msg: 'get de rol Api-control'
    });
}

const rolePost = async(req = request, res = response) => {

    const { role } = req.body;
    const rol = new Role({ role });

    await rol.save();

    res.json({
        rol
    });
}

const roleDelete = (req = request, res = response) => {
    res.json({
        msg: 'delete de rol Api-control'
    });
}

module.exports = { roleGet, rolePost, roleDelete }