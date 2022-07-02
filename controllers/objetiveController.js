const { request, response } = require('express');

const { deleteObjective } = require('../helpers/removeModels');
const Area = require('../models/area');
const Criterion = require('../models/criterion');
const Objective = require('../models/objective');

const objectiveGet = async(req = request, res = response) => {
    try {
        const { begin = 0, amount = 5} = req.query;
    
        const [ total, objectives ] = await Promise.all([
            Objective.countDocuments(),
            Objective.find().skip(Number(begin)).limit(Number(amount))
        ]);
    
        res.json({
            total,
            objectives
        });
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const objectivePost = async(req = request, res = response) => {
    
    try {
        const area = await Area.findById(req.params.id);
        if (!area) {
            res.status(404).json({msg: 'El area no existe en la BD'});
        }
    
        let criterions = [];
        const criterionNames = req.body.criterions;
        if(criterionNames){
            criterionNames.forEach( name => criterions.push({name}));
            criterions = await Criterion.create(criterions);
        }
        
        const { name } = req.body;
        const objective = new Objective({ name, criterions });
        area.objectives.push(objective);
        
        await Promise.all([
            objective.save(),
            area.save()
        ])
        
        res.status(201).json(objective);
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const objectivePut = async(req = request, res = response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
    
        await Objective.findByIdAndUpdate(id, {name});
    
        res.json({ msg: 'Objetivo Estratégico actualizado' });
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const addCriterions = async(req, res = response) => {
    try {
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
        await objective.save();
    
        res.json({ msg: 'Criterios de Medidas añadidos' });
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const objectiveDelete = async(req = request, res = response) => {
    try {
        await deleteObjective(req.params.id, req.params.idArea);
        res.json({msg: 'Objetivo eliminado'});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

module.exports = { addCriterions, objectiveGet, objectivePost, objectivePut, objectiveDelete }