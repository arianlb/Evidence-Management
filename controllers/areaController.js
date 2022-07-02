const { response } = require('express');

const { indicatorByCriterion } = require('../helpers/indicatorResponse');
const { deleteArea } = require('../helpers/removeModels');
const Area = require('../models/area');
const Objective = require('../models/objective');

/*const areaGet = async(req, res = response) => {
    const { begin = 0, amount = 5 } = req.query;

    const [ total, areas ] = await Promise.all([
        Area.countDocuments(),
        Area.find().populate('objectives').skip(Number(begin)).limit(Number(amount))
    ]);

    res.json({ total, areas });
}*/

const areaGet = async(req, res = response) => {
    try {
        const areas = [];
        const areaData = await Area.find().populate('objectives', 'name');
        
        for(let a of areaData){
            const area = { _id: a._id, name: a.name, objectives: [] };
            a.objectives.forEach( ({name}) => { area.objectives.push(name); });
            areas.push(area);
        }
    
        res.json( areas );
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const areaById = async(req, res = response) => {
    try {
        const area = await Area.findById(req.params.id).populate({
            path: 'objectives',
            populate: {path: 'criterions'}
        });
        const objectives = await indicatorByCriterion(area);
        const { _id, name } = area;
        res.json({ _id, name, objectives });
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const areaPost = async(req, res = response) => {
    try {
        const { name } = req.body;
    
        //TODO: optimize!!
        let objectives = [];
        const targetNames = req.body.objectives;
        if(targetNames){
            targetNames.forEach( name => objectives.push({name}));
            objectives = await Objective.create(objectives);
        }
        
        const area = new Area({ name, objectives });
    
        await area.save();
        const responseArea = { _id: area._id, name: area.name, objectives: targetNames};
        res.status(201).json(responseArea);
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const areaPut = async(req, res = response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
    
        await Area.findByIdAndUpdate(id, {name});
    
        res.json({ msg: 'Area actualizada' });
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const addObjectives = async(req, res = response) => {
    try {
        const { id } = req.params;
        const area = await Area.findById(id);
        if(!area) {
            return res.status(404).json({
                msg: `El id ${id} no exite en la BD`
            })
        }
        
        const { objectives } = req.body;
        if(!objectives) {
            return res.status(400).json({
                msg: 'No se recibió los objetivos para adicionar'
            })
        }
    
        area.objectives = area.objectives.concat(objectives);
        area.save();
    
        res.json({ msg: 'Objetivos añadidos' });
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const addUsers = async(req, res = response) => {
    try {
        const { id } = req.params;
        const area = await Area.findById(id);
        if(!area) {
            return res.status(404).json({
                msg: `El id ${id} no exite en la BD`
            })
        }
        
        const { users } = req.body;
        if(!users) {
            return res.status(400).json({
                msg: 'No se recibió los usuarios para adicionar'
            })
        }
    
        area.users = area.users.concat(users);
        area.save();
    
        res.json({ msg: 'Usuarios añadidos' });
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const areaDelete = async(req, res = response) => {
    try {
        await deleteArea(req.params.id);
        res.json({ msg: 'Area eliminada'});
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

module.exports = { areaGet, areaPost, areaPut, areaDelete, addObjectives, addUsers, areaById }