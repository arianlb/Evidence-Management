const { request, response} = require('express');

const Evaluation = require('../models/evaluation');
const User = require('../models/user');

const evaluationGet = async(req = request, res = response) => {
    
    try {
        const { begin = 0, amount = 5} = req.query;
    
        const [ total, evaluation ] = await Promise.all([
            Evaluation.countDocuments(),
            Evaluation.find().skip(Number(begin)).limit(Number(amount))
        ]);
    
        res.json({
            total,
            evaluation
        });
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const evaluationPost = async(req = request, res = response) => {

    try {
        const { name } = req.body;
        const evaluation = new Evaluation({ name });
    
        await Promise.all([
            evaluation.save(),
            User.findByIdAndUpdate(req.params.id, {evaluation})
        ])
    
        res.json(evaluation);
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const evaluationPut = async(req = request, res = response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
    
        await Evaluation.findByIdAndUpdate(id, {name});
        
        res.json({
            msg: 'Evaluación actualizada',
        });
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const evaluationDelete = async(req = request, res = response) => {

    try {
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({
                msg: 'No existe el Usuario en la base de datos'
            })
        }
    
        if(user.evaluation){
            const id = user.evaluation;
            user.evaluation = undefined;
            await Promise.all([
                Evaluation.findByIdAndDelete(id),
                user.save()
            ]);
        }
        
        res.json({ msg: 'Evaluación eliminada'});
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

module.exports = { evaluationGet, evaluationPost, evaluationPut, evaluationDelete}