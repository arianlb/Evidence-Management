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
        req.log.info('Obtuvo todas las Evaluaciones');
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
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
    
        res.status(201).json(evaluation);
        req.log.info(`Creo la evaluacion: ${name} del usuario: ${req.params.id}`);
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
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
        req.log.info(`Actualizo la Evaluacion: ${id}`);
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const evaluationDelete = async(req = request, res = response) => {

    try {
        const user = await User.findById(req.params.id);
        if(!user){
            req.log.warn(`No existe el Usuario: ${req.params.id} para eliminar su evaluacion`);
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
        req.log.info(`Elimino la Evaluacion del Usuario: ${req.params.id}`);
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

module.exports = { evaluationGet, evaluationPost, evaluationPut, evaluationDelete}