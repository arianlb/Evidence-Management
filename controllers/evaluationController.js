const { request, response} = require('express');

const Evaluation = require('../models/evaluation');
const User = require('../models/user');

const evaluationGet = async(req = request, res = response) => {
    
    const { begin = 0, amount = 5} = req.query;

    const [ total, evaluation ] = await Promise.all([
        Evaluation.countDocuments(),
        Evaluation.find().skip(Number(begin)).limit(Number(amount))
    ]);

    res.json({
        total,
        evaluation
    });
}

const evaluationPost = async(req = request, res = response) => {

    const { name } = req.body;
    const evaluation = new Evaluation({ name });

    await Promise.all([
        evaluation.save(),
        User.findByIdAndUpdate(req.params.id, {evaluation})
    ])

    res.json(evaluation);
}

const evaluationPut = async(req = request, res = response) => {
    const { id } = req.params;
    const { name } = req.body;

    await Evaluation.findByIdAndUpdate(id, {name});
    
    res.json({
        msg: 'Evaluación actualizada',
    });
}

const evaluationDelete = async(req = request, res = response) => {
    const { id } = req.params;
    const evaluation = await Evaluation.findByIdAndDelete(id);
    res.json(evaluation);
}

module.exports = { evaluationGet, evaluationPost, evaluationPut, evaluationDelete}