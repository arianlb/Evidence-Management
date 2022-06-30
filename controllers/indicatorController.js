const { request, response} = require('express');

const { indicatorsByCategory } = require('../helpers/indicatorResponse');
const { updateCriterion } = require('../helpers/modifyCriterion');
const { deleteIndicator } = require('../helpers/removeModels');
const Criterion = require('../models/criterion');
const Indicator = require('../models/indicator');
const User = require('../models/user');

const indicatorGet = async(req = request, res = response) => {
    
    const { begin = 0, amount = 5} = req.query;

    const [ total, indicator ] = await Promise.all([
        Indicator.countDocuments(),
        Indicator.find().skip(Number(begin)).limit(Number(amount))
    ]);

    res.json({
        total,
        indicator
    });
}

const indicatorByCategory = async(req = request, res = response) => {
    const indicators = await indicatorsByCategory(req.body.categories);
    res.json(indicators);
}

const indicatorsByUser = async(req = request, res = response) => {
    const indicators = await indicatorsByCategory(req.body.categories, req.params.id);
    const has = indicators.length > 0;
    res.json({ has, indicators });
}

const indicatorById = async(req = request, res = response) => {
    const indicator = await Indicator.findById(req.params.id).populate(['criterion', 'evidences']);
    if(!indicator) {
        return res.status(404).json({msg: 'Indicator no existe en la BD'});
    }
    res.json(indicator);
}

const indicatorPost = async(req = request, res = response) => {

    const user = await User.findById(req.params.id).populate('indicators');
    if(!user){
        return res.status(404).json({
            msg: 'No existe el Usuario en la base de datos'
        });
    }

    let indicators = [];
    let indicatorsModels = await Indicator.find({_id: {$in: req.body.indicators}});

    if(user.indicators) {
        for(let i = 0; i < indicatorsModels.length; i++) {
            for(let j = 0; j < user.indicators.length; j++) {
                if(indicatorsModels[i].name === user.indicators[j].name &&
                indicatorsModels[i].category === user.indicators[j].category) {

                    if(user.indicators[j].criterion) {
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
                            await updateCriterion(user.indicators[j].criterion, 1);
                        }
                        break;
                    }
                }
                    
            }
        }
    }

    indicatorsModels.forEach(indicator => indicators.push({
        name: indicator.name,
        category: indicator.category,
        criterion: indicator.criterion,
        model: false
    }));
    
    indicators = await Indicator.create(indicators);
    user.indicators = user.indicators.concat(indicators);
    await user.save();

    res.json(indicators);
}

const indicatorPostByCriterion = async(req = request, res = response) => {

    const criterion = await Criterion.findById(req.params.id);
    if(!criterion){
        return res.status(404).json({
            msg: 'No existe el Criterio de medida en la base de datos'
        })
    }

    const { name, category } = req.body;
    const indicator = new Indicator({ name, category, criterion });
    await indicator.save();

    res.json(indicator);
}

const indicatorPut = async(req = request, res = response) => {
    const { id } = req.params;
    const { name } = req.body;

    await Indicator.findByIdAndUpdate(id, {name});
    
    res.json({
        msg: 'Indicador actualizado',
    });
}

const indicatorDelete = async(req = request, res = response) => {
    try {
        await deleteIndicator(req.params.id, req.params.idUser);
        res.json({msg: 'Indicador eliminado'});
    } catch (msg) {
        res.status(400).json({msg: 'Error eliminando el indicador'});
    }
}

const indicatorModelDelete = async(req = request, res = response) => {
    const indicator = await Indicator.findByIdAndDelete(req.params.id);
    res.json(indicator);
}

module.exports = {  indicatorByCategory,
                    indicatorById,
                    indicatorsByUser,
                    indicatorGet,
                    indicatorPost,
                    indicatorPostByCriterion,
                    indicatorPut,
                    indicatorDelete,
                    indicatorModelDelete}