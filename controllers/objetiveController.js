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

const objectiveDelete = async(req = request, res = response) => {
    const { id } = req.params;
    const objectiveD = await Objective.findByIdAndDelete(id);
    res.json({ objectiveD });
}

module.exports = { objectiveGet, objectivePost, objectivePut, objectiveDelete }