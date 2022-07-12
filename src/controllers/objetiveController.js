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
        req.log.info('Obtuvo todos los Objetivos');
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const objectivePost = async(req = request, res = response) => {
    
    try {
        const area = await Area.findById(req.params.id);
        if (!area) {
            req.log.warn(`El Area: ${req.params.id} no exite en la BD para asociarle el Objetivo`);
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
        req.log.info(`Creo el Objetivo: ${objective._id} del Area: ${req.params.id}`)
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const objectivePut = async(req = request, res = response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
    
        await Objective.findByIdAndUpdate(id, {name});
    
        res.json({ msg: 'Objetivo Estratégico actualizado' });
        req.log.info(`Actualizo el Objetivo: ${id}`);
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const addCriterions = async(req, res = response) => {
    try {
        const { id } = req.params;
        const objective = await Objective.findById(id);
        if(!objective) {
            req.log.warn(`El Objetivo: ${id} no existe en la BD para asociarle los Criterios`);
            return res.status(404).json({
                msg: `El Objetivo: con el id: ${id} no exite en la BD`
            })
        }
        
        const { criterions } = req.body;
        if(!criterions) {
            req.log.warn(`No se recibio los criterios para asociarle al Objetivo: ${id}`);
            return res.status(400).json({
                msg: 'No se recibió los criterios de medida para adicionar'
            })
        }
    
        objective.criterions = objective.criterions.concat(criterions);
        await objective.save();
    
        res.json({ msg: 'Criterios de Medidas añadidos' });
        req.log.info(`Asocio los criterios al Objetivo: ${id}`)
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const objectiveDelete = async(req = request, res = response) => {
    try {
        await deleteObjective(req.params.id, req.params.idArea);
        res.json({id: req.params.id});
        req.log.info(`Elimino el Objetivo: ${req.params.id} del Area: ${req.params.idArea}`);
    } catch (error) {
        res.status(500).json({msg: error.message});
        req.log.error(error.message);
    }
}

module.exports = { addCriterions, objectiveGet, objectivePost, objectivePut, objectiveDelete }