const { request, response} = require('express');

const { deleteCriterion } = require('../helpers/removeModels');
const Criterion = require('../models/criterion');
const Objective = require('../models/objective');

const criterionGet = async(req = request, res = response) => {
    
    try {
        const { begin = 0, amount = 5} = req.query;
    
        const [ total, criterions ] = await Promise.all([
            Criterion.countDocuments(),
            Criterion.find().skip(Number(begin)).limit(Number(amount))
        ]);
    
        res.json({
            total,
            criterions
        });
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const criterionPost = async(req = request, res = response) => {

    try {
        const objective = await Objective.findById(req.params.id);
        if(!objective){
            return res.status(404).json({msg: 'El objetivo no existe en la BD'});
        }
    
        const { name, todo } = req.body;
        const criterion = new Criterion({ name, todo });
        objective.criterions.push(criterion);
    
        await Promise.all([
            criterion.save(),
            objective.save()
        ]);
    
        res.status(201).json(criterion);
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const criterionPut = async(req = request, res = response) => {
    try {
        const { id } = req.params;
        const { _id, concluded, status, ...rest } = req.body;
    
        await Criterion.findByIdAndUpdate(id, rest);
        
        res.json({
            msg: 'Criterio de medida actualizado',
        });
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

//Por definir
/*const changeStatus = async(req = request, res = response) => {
    const { id } = req.params;
    const { status } = req.body;

    await Criterion.findByIdAndUpdate(id, {status});
    
    res.json({
        msg: 'Criterio de medida actualizado',
    });
}*/

const criterionDelete = async(req = request, res = response) => {
    try {
        await deleteCriterion(req.params.id, req.params.idObjective);
        res.json({msg: 'Criterio de medida eliminado'});
    } catch (msg) {
        res.status(400).json({msg: 'Error eliminando el criterio de medida'});
    }
}

module.exports = { criterionGet, criterionPost, criterionPut, criterionDelete}