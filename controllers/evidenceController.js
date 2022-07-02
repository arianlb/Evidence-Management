const path = require('path');
const fs = require('fs');
const { request, response} = require('express');

const { updateCriterion } = require('../helpers/modifyCriterion');
const { deleteEvidence } = require('../helpers/removeModels');
const { upload } = require('../helpers/uploadFile');
const Evidence = require('../models/evidence');
const Indicator = require('../models/indicator');

const evidenceGet = async(req = request, res = response) => {
    
    try {
        const { begin = 0, amount = 5} = req.query;
    
        const [ total, evidence ] = await Promise.all([
            Evidence.countDocuments(),
            Evidence.find().skip(Number(begin)).limit(Number(amount))
        ]);
    
        res.json({
            total,
            evidence
        });
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const evidenceGetFile = async(req = request, res = response) => {
    
    try{
        const evidence = await Evidence.findById(req.params.id);
        if(!evidence){
            return res.status(404).json({msg: 'La evidencia no existe en la BD'});
        }

        if(evidence.file){
            const pathFile = path.join( __dirname, '../uploads/evidences/', evidence.file);
            if(fs.existsSync(pathFile)){
                return res.sendFile(pathFile);
            }
        }
        
        res.status(404).json({msg: 'La evidencia no tiene archivo'});

    } catch(error){
        res.status(500).json({msg: error.message});
    }
}

const evidencePost = async(req = request, res = response) => {
    
    try {
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
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const evidencePut = async(req = request, res = response) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
    
        await Evidence.findByIdAndUpdate(id, {description});
        
        res.json({
            msg: 'Evidencia actualizada',
        });
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const evidenceDelete = async(req = request, res = response) => {
    try {
        await deleteEvidence(req.params.id, req.params.idIndicator);
        res.json({msg: 'Evidencia eliminada'});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

const evidenceUpload = async (req = request, res = response) => {

    try{
        const evidence = await Evidence.findById(req.params.id);
        if(!evidence){
            return res.status(404).json({msg: 'La evidencia no existe en la BD'});
        }

        if(evidence.file){
            const pathFile = path.join( __dirname, '../uploads/evidences/', evidence.file);
            if(fs.existsSync(pathFile)){
                fs.unlinkSync(pathFile);
            }
        }

        const name = await upload(req.files.file);
        evidence.file = name;
        await evidence.save();
        res.json(evidence);

    } catch(error){
        res.status(400).json({msg: error.message});
    }
}

module.exports = { evidenceGet, evidenceGetFile, evidencePost, evidencePut, evidenceDelete, evidenceUpload}