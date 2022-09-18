const path = require('path');
const fs = require('fs');
const { request, response } = require('express');

const { updateCriterion } = require('../helpers/modifyCriterion');
const { deleteEvidence } = require('../helpers/removeModels');
const { upload } = require('../helpers/uploadFile');
const Evidence = require('../models/evidence');
const Indicator = require('../models/indicator');
const User = require('../models/user');

const evidenceGet = async (req = request, res = response) => {

    try {
        const { begin = 0, amount = 5 } = req.query;

        const [total, evidence] = await Promise.all([
            Evidence.countDocuments(),
            Evidence.find().skip(Number(begin)).limit(Number(amount))
        ]);

        res.json({
            total,
            evidence
        });
        req.log.info('Obtuvo todas las Evidencias');

    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const evidenceGetFile = async (req = request, res = response) => {

    try {
        const evidence = await Evidence.findById(req.params.id);
        if (!evidence) {
            req.log.warn(`La Evidencia: ${req.params.id} no exite en la BD para devolver su archivo`);
            return res.status(404).json({ msg: 'La evidencia no existe en la BD' });
        }

        if (evidence.file) {
            const pathFile = path.join(__dirname, '../../uploads/evidences/', evidence.file);
            if (fs.existsSync(pathFile)) {
                req.log.info(`Obtuvo el archivo de la Evidencia: ${req.params.id}`);
                return res.sendFile(pathFile);
            }
        }

        res.status(404).json({ msg: 'La evidencia no tiene archivo' });
        req.log.warn(`La Evidencia: ${req.params.id} no tiene archivo`);

    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const evidencePost = async (req = request, res = response) => {

    try {
        const indicator = await Indicator.findById(req.params.id);
        if (!indicator) {
            req.log.warn(`El Indicador: ${req.params.id} no exite en la BD para asociarle una evidencia`);
            return res.status(404).json({
                msg: 'El Indicador no existe en la BD'
            })
        }

        const { description } = req.body;
        const evidence = new Evidence({ description });
        indicator.evidences.push(evidence);

        if (!indicator.status) {
            indicator.status = true;
            
            if (indicator.criterion) {
                updateCriterion(indicator.criterion, 1);
            }
        }

        const [user, , ] =await Promise.all([
            User.findById(req.authid),
            evidence.save(),
            indicator.save()
        ]);

        const userChief = await User.find({ department: user.department, role: 'ROLE_CHIEF' });
        if (userChief) {
            userChief.notifications.push(`${user.name} realizó el indicador ${indicator.name}.`);
            await userChief.save();
            const io = req.app.get('io');
            io.to(userChief._id).emit('notifications', userChief.notifications.length);
        }

        res.status(201).json(evidence);
        req.log.info(`Creo la Evidencia: ${evidence._id} del Indicador: ${indicator._id}`);

    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const evidencePut = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        const updatedEvidence = await Evidence.findByIdAndUpdate(id, { description }, { returnDocument: 'after' });

        res.json(updatedEvidence);
        req.log.info(`Actualizo la Evidencia: ${id}`);

    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const evidenceDelete = async (req = request, res = response) => {
    try {
        await deleteEvidence(req.params.id, req.params.idIndicator);
        res.json({ id: req.params.id });
        req.log.info(`Elimino la Evidencia: ${req.params.id} del Indicador: ${req.params.idIndicator}`);
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const evidenceUpload = async (req = request, res = response) => {

    try {
        const evidence = await Evidence.findById(req.params.id);
        if (!evidence) {
            req.log.warn(`La Evidencia: ${req.params.id} no exite en la BD para asociarle un archivo`);
            return res.status(404).json({ msg: 'La evidencia no existe en la BD' });
        }

        if (evidence.file) {
            const pathFile = path.join(__dirname, '../../uploads/evidences/', evidence.file);
            if (fs.existsSync(pathFile)) {
                fs.unlinkSync(pathFile);
            }
        }

        const name = await upload(req.files.file);
        evidence.file = name;
        await evidence.save();
        res.json(evidence);
        req.log.info(`Asocio un archivo a la Evidencia: ${req.params.id}`);

    } catch (error) {
        res.status(400).json({ msg: error.message });
        req.log.error(error.message);
    }
}

module.exports = { evidenceGet, evidenceGetFile, evidencePost, evidencePut, evidenceDelete, evidenceUpload }