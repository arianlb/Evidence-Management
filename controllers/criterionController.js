const { request, response} = require('express');

const Criterion = require('../models/criterion');

const criterionGet = async(req = request, res = response) => {
    
    const { begin = 0, amount = 5} = req.query;

    const [ total, criterions ] = await Promise.all([
        Criterion.countDocuments(),
        Criterion.find().skip(Number(begin)).limit(Number(amount))
    ]);

    res.json({
        total,
        criterions
    });
}

const criterionPost = async(req = request, res = response) => {

    const { name } = req.body;
    const criterion = new Criterion({ name });

    await criterion.save();

    res.json(criterion);
}

const criterionPut = async(req = request, res = response) => {
    const { id } = req.params;
    const { name } = req.body;

    await Criterion.findByIdAndUpdate(id, {name});
    
    res.json({
        msg: 'Criterio de medida actualizado',
    });
}

const criterionDelete = async(req = request, res = response) => {
    const { id } = req.params;
    const criterion = await Criterion.findByIdAndDelete(id);
    res.json(criterion);
}

module.exports = { criterionGet, criterionPost, criterionPut, criterionDelete}