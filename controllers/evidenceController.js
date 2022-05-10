const { request, response} = require('express');

const Evidence = require('../models/evidence');

const evidenceGet = async(req = request, res = response) => {
    
    const { begin = 0, amount = 5} = req.query;

    const [ total, evidence ] = await Promise.all([
        Evidence.countDocuments(),
        Evidence.find().skip(Number(begin)).limit(Number(amount))
    ]);

    res.json({
        total,
        evidence
    });
}

const evidencePost = async(req = request, res = response) => {

    const { description } = req.body;
    const evidence = new Evidence({ description });

    await evidence.save();

    res.json(evidence);
}

const evidencePut = async(req = request, res = response) => {
    const { id } = req.params;
    const { description } = req.body;

    await Evidence.findByIdAndUpdate(id, {description});
    
    res.json({
        msg: 'Evidencia actualizada',
    });
}

const evidenceDelete = async(req = request, res = response) => {
    const { id } = req.params;
    const evidence = await Evidence.findByIdAndDelete(id);
    res.json(evidence);
}

module.exports = { evidenceGet, evidencePost, evidencePut, evidenceDelete}