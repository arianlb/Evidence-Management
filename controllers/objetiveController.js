const { request, response } = require('express');

const Objective = require('../models/objective');

const objectiveGet = async(req = request, res = response) => {
    const { begin = 0, amount = 5} = req.query;

    const [ total, objectives ] = await Promise.all([
        Objective.countDocuments(),
        Objective.find().skip(Number(begin)).limit(Number(amount))
    ]);

    res.json({
        total,
        objectives
    });
}

const objectivePost = async(req = request, res = response) => {
    const { name } = req.body;
    const objective = new Objective({ name });
    await objective.save();
    res.status(201).json(objective);
}

const objectivePut = async(req = request, res = response) => {
    const { id } = req.params;
    const { name } = req.body;

    await Objective.findByIdAndUpdate(id, {name});

    res.json({ msg: 'Objetivo Estratégico actualizado' });
}

const addCriterions = async(req, res = response) => {
    const { id } = req.params;
    const objective = await Objective.findById(id);
    if(!objective) {
        return res.status(404).json({
            msg: `El id ${id} no exite en la BD`
        })
    }
    
    const { criterions } = req.body;
    if(!criterions) {
        return res.status(400).json({
            msg: 'No se recibió los criterios de medida para adicionar'
        })
    }

    objective.criterions = objective.criterions.concat(criterions);
    objective.save();

    res.json({ msg: 'Criterios de Medidas añadidos' });
}

const objectiveDelete = async(req = request, res = response) => {
    const { id } = req.params;
    const objectiveD = await Objective.findByIdAndDelete(id);
    res.json({ objectiveD });
}

module.exports = { addCriterions, objectiveGet, objectivePost, objectivePut, objectiveDelete }