const { request, response } = require('express');

const { deleteEvaluation } = require('../helpers/removeModels');
const Evaluation = require('../models/evaluation');
const User = require('../models/user');

const evaluationGet = async (req = request, res = response) => {
    
    try {
        const { year } = req.query;
        const user = await User.findById(req.params.id).populate({
            path: 'evaluations',
            match: { year }
        });
        if (!user) {
            req.log.warn(`El Usuario: ${req.params.id} no existe en la BD`);
            return res.status(404).json({
                msg: 'No existe el Usuario en la base de datos'
            });
        }

        res.json(user.evaluations);
        req.log.info(`Obtuvo las Evaluaciones del anio: ${year} del Usuario: ${req.params.id}`);

    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const evaluationPost = async (req = request, res = response) => {
    
    try {
        const { year, categories, total } = req.body;

        const user = await User.findById(req.params.id).populate('evaluations');
        if (!user) {
            req.log.warn(`El Usuario: ${req.params.id} no existe en la BD`);
            return res.status(404).json({
                msg: 'No existe el Usuario en la base de datos'
            });
        }

        for (evaluationU of user.evaluations) {
            if (evaluationU.year === year) {
                console.log('Ya existe una evaluacion para el anio: ' + year);
                const evaluationResponse = await Evaluation.findByIdAndUpdate(evaluationU._id, {categories, total}, { returnDocument: 'after' });
                req.log.info(`Se actualizo la Evaluacion: ${evaluationU._id} para el Usuario: ${req.params.id}`);
                return res.json(evaluationResponse);
            }
        }

        const evaluation = new Evaluation({ year, categories, total });
        user.evaluations.push(evaluation);
        await Promise.all([evaluation.save(), user.save()]);
        res.status(201).json(evaluation);
        req.log.info(`Se creo la Evaluacion: ${evaluation._id} para el Usuario: ${req.params.id}`);
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const evaluationPut = async (req = request, res = response) => {
        
    try {
        const { id } = req.params;
        const { _id, ...rest } = req.body;
        const evaluation = await Evaluation.findByIdAndUpdate(id, rest, { returnDocument: 'after' });
        res.json(evaluation);
        req.log.info(`Actualizo la Evaluacion: ${id}`);
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const evaluationDelete = async (req = request, res = response) => {
        
    try {
        const { id, idUser } = req.params;
        await deleteEvaluation(id, idUser);
        res.json({ id });
        req.log.info(`Elimino la Evaluacion: ${id} del Usuario: ${idUser}`);
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

module.exports = { evaluationGet, evaluationPost, evaluationPut, evaluationDelete };