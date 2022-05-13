const { response } = require('express');

const Area = require('../models/area');

const areaGet = async(req, res = response) => {
    const { begin = 0, amount = 5 } = req.query;

    const [ total, areas ] = await Promise.all([
        Area.countDocuments(),
        Area.find().skip(Number(begin)).limit(Number(amount))
    ]);

    res.json({ total, areas });
}

const areaPost = async(req, res = response) => {
    const { name } = req.body;
    const area = new Area({ name });

    await area.save();
    res.status(201).json(area);
}

const areaPut = async(req, res = response) => {
    const { id } = req.params;
    const { name } = req.body;

    await Area.findByIdAndUpdate(id, {name});

    res.json({ msg: 'Area actualizada' });
}

const addObjectives = async(req, res = response) => {
    const { id } = req.params;
    const area = await Area.findById(id);
    if(!area) {
        return res.status(404).json({
            msg: `El id ${id} no exite en la BD`
        })
    }
    
    const { objectives } = req.body;
    if(!objectives) {
        return res.status(400).json({
            msg: 'No se recibió los objetivos para adicionar'
        })
    }

    area.objectives = area.objectives.concat(objectives);
    area.save();

    res.json({ msg: 'Objetivos añadidos' });
}

const addUsers = async(req, res = response) => {
    const { id } = req.params;
    const area = await Area.findById(id);
    if(!area) {
        return res.status(404).json({
            msg: `El id ${id} no exite en la BD`
        })
    }
    
    const { users } = req.body;
    if(!users) {
        return res.status(400).json({
            msg: 'No se recibió los usuarios para adicionar'
        })
    }

    area.users = area.users.concat(users);
    area.save();

    res.json({ msg: 'Usuarios añadidos' });
}

const areaDelete = async(req, res = response) => {
    const { id } = req.params;
    const areaD = await Area.findByIdAndDelete(id);
    res.json({ areaD });
}

module.exports = { areaGet, areaPost, areaPut, areaDelete, addObjectives, addUsers }