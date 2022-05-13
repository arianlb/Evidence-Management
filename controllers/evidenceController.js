const { request, response} = require('express');

const { updateCriterion } = require('../helpers/modifyCriterion');
const Evidence = require('../models/evidence');
const Indicator = require('../models/indicator');

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
    
    const indicator = await Indicator.findById(req.params.id);
    if(!indicator) {
        return res.status(404).json({
            msg: 'El Indicador no existe en la BD'
        })
    }

    const { description } = req.body;
    const evidence = new Evidence({ description });
    indicator.evidences.push(evidence);
    
    if(!indicator.status){
        indicator.status = true;
        //TODO: investigar una mejor forma
        if(indicator.criterion){
            updateCriterion(indicator.criterion, 1);
        }
    }

    await Promise.all([
        evidence.save(),
        indicator.save()
    ]);

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