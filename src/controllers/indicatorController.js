const { request, response } = require('express');

const { indicatorArea, indicatorsByCategory } = require('../helpers/indicatorResponse');
const { updateCriterion } = require('../helpers/modifyCriterion');
const { deleteIndicator } = require('../helpers/removeModels');
const Criterion = require('../models/criterion');
const Indicator = require('../models/indicator');
const User = require('../models/user');

const indicatorGet = async (req = request, res = response) => {

    try {
        const { begin = 0, amount = 5 } = req.query;

        const [total, indicator] = await Promise.all([
            Indicator.countDocuments(),
            Indicator.find().skip(Number(begin)).limit(Number(amount))
        ]);

        res.json({
            total,
            indicator
        });
        req.log.info('Obtuvo todos los Indicadores');

    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const indicatorByCategory = async (req = request, res = response) => {
    try {
        const indicators = await indicatorsByCategory(req.body.categories, req.authdepartment);
        res.json(indicators);
        req.log.info('Obtuvo todos los Indicadores Modelos del Area: ', req.authdepartment);

    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const indicatorsByUser = async (req = request, res = response) => {
    try {
        const indicators = await indicatorsByCategory(req.body.categories, req.authdepartment, req.params.id);
        let has = false;

        for (let i = 0; i < indicators.length; i++) {
            if (indicators[i].indicators.length > 0) {
                has = true;
                break;
            }
        }

        res.json({ has, indicators });
        req.log.info('Obtuvo todos los Indicadores del Usuario: ' + req.params.id);

    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const indicatorById = async (req = request, res = response) => {
    try {
        const indicator = await Indicator.findById(req.params.id).populate(['criterion', 'evidences']);
        if (!indicator) {
            req.log.warn(`El Indicador: ${req.params.id} no existe en la BD`);
            return res.status(404).json({ msg: 'Indicator no existe en la BD' });
        }
        res.json(indicator);
        req.log.info(`Obtuvo el Indicador: ${req.params.id}`)

    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const indicatorPost = async (req = request, res = response) => {

    try {
        const user = await User.findById(req.params.id).populate('indicators');
        if (!user) {
            req.log.warn(`El Usuario: ${req.params.id} no existe en la BD para asociarle indicadores`);
            return res.status(404).json({
                msg: 'No existe el Usuario en la base de datos'
            });
        }

        let indicators = [];
        let indicatorsModels = await Indicator.find({ _id: { $in: req.body.indicators } });

        if (user.indicators) {
            for (let i = 0; i < indicatorsModels.length; i++) {
                for (let j = 0; j < user.indicators.length; j++) {
                    if (indicatorsModels[i].name === user.indicators[j].name &&
                        indicatorsModels[i].category === user.indicators[j].category) {

                        if (user.indicators[j].criterion) {
                            req.log.warn(`El usuario ya tiene el indicador ${user.indicators[j].name} 
                                            de la categoria ${user.indicators[j].category}`);
                            return res.status(400).json({
                                msg: `El usuario ya tiene el indicador ${user.indicators[j].name} 
                                    de la categoria ${user.indicators[j].category}`
                            });
                        }
                        else {
                            user.indicators[j].criterion = indicatorsModels[i].criterion;
                            indicatorsModels.splice(i--, 1);
                            await user.indicators[j].save();
                            if (user.indicators[j].status) {
                                updateCriterion(user.indicators[j].criterion, 1);
                            }
                            break;
                        }
                    }

                }
            }
        }

        indicatorsModels.forEach(indicator => {
            indicators.push({
                name: indicator.name,
                category: indicator.category,
                criterion: indicator.criterion,
                model: false
            });
            user.notifications.push('Tiene un nuevo Indicador: ' + indicator.name);
        });

        indicators = await Indicator.create(indicators);
        user.indicators = user.indicators.concat(indicators);
        await user.save();
        const io = req.app.get('io');
        io.to(user._id.toString()).emit('notifications', user.notifications.length);

        res.json(indicators);
        req.log.info(`Asocio indicadores al Usuario: ${req.params.id}`)

    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const indicatorPostByCriterion = async (req = request, res = response) => {

    try {
        const criterion = await Criterion.findById(req.params.id);
        if (!criterion) {
            req.log.warn(`El Criterio: ${req.params.id} no existe en la BD para asociarle el Indicador Modelo`);
            return res.status(404).json({
                msg: 'No existe el Criterio de medida en la base de datos'
            })
        }

        const department = await indicatorArea(req.params.id);
        const { name, category } = req.body;
        const indicator = new Indicator({ name, category, criterion, department });
        await indicator.save();

        res.status(201).json(indicator);
        req.log.info(`Creo el Indicador Modelo: ${indicator._id}`)

    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const personalIndicatorPost = async (req = request, res = response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            req.log.warn(`El Usuario: ${req.params.id} no existe en la BD para asociarle indicadores`);
            return res.status(404).json({
                msg: 'No existe el Usuario en la base de datos'
            });
        }

        const { name, category, observation } = req.body;
        const indicator = new Indicator({ name, category, observation, status: true });
        user.indicators.push(indicator);

        await Promise.all([
            indicator.save(),
            user.save()
        ]);

        res.status(201).json(indicator);
        req.log.info(`El Usuario ${req.params.id} creo el Indicador Personal: ${indicator._id}`)

    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }

}

const indicatorPut = async (req = request, res = response) => {
    try {
        const indicator = await Indicator.findById(req.params.id);
        let updatedIndicator = {};
        if (!indicator) {
            req.log.warn(`El Indicador con el id: ${req.params.id} no exite en la BD`);
            return res.status(404).json({
                msg: `El Indicador con el id ${req.params.id} no exite en la BD`
            })
        }

        if (indicator.model) {
            const { name, category, criterion } = req.body;
            updatedIndicator = await Indicator.findByIdAndUpdate(req.params.id, { name, category, criterion }, { returnDocument: 'after' });
        }
        else {
            const { _id, model, status, ...rest } = req.body;
            if (status !== indicator.status) {
                updateCriterion(indicator.criterion, status ? 1 : -1);
            }
            rest.status = status;
            updatedIndicator = await Indicator.findByIdAndUpdate(req.params.id, rest, { returnDocument: 'after' });
        }

        res.json(updatedIndicator);
        req.log.info(`Actualizo el Indicador: ${req.params.id}`)

    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const indicatorDelete = async (req = request, res = response) => {
    try {
        await deleteIndicator(req.params.id, req.params.idUser);
        res.json({ id: req.params.id });
        req.log.info(`Elimino el Indicador: ${req.params.id} del Usuario: ${req.params.idUser}`);
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const indicatorModelDelete = async (req = request, res = response) => {
    try {
        const indicator = await Indicator.findByIdAndDelete(req.params.id);
        res.json({ id: req.params.id });
        req.log.info(`Elimino el Indicador Modelo: ${req.params.id}`);

    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

module.exports = {
    indicatorByCategory,
    indicatorById,
    indicatorsByUser,
    indicatorGet,
    indicatorPost,
    indicatorPostByCriterion,
    personalIndicatorPost,
    indicatorPut,
    indicatorDelete,
    indicatorModelDelete
}