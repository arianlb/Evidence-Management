const { request, response} = require('express');

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

const indicatorPost = async(req = request, res = response) => {

    const user = await User.findById(req.params.id);
    if(!user){
        return res.status(404).json({
            msg: 'No existe el Usuario en la base de datos'
        })
    }

    const { name } = req.body;
    const indicator = new Indicator({ name });
    user.indicators.push(indicator);

    await Promise.all([
        indicator.save(),
        user.save()
    ]);

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

//Por definir
/*const assignCriterion = async(req = request, res = response) => {
    const { id } = req.params;
    const { name } = req.body;

    await Indicator.findByIdAndUpdate(id, {name});
    
    res.json({
        msg: 'Indicador actualizado',
    });
}*/

//Por definir
/*const addEvidence = async(req = request, res = response) => {
    const { id } = req.params;
    const { name } = req.body;

    await Indicator.findByIdAndUpdate(id, {name});
    
    res.json({
        msg: 'Indicador actualizado',
    });
}*/

const indicatorDelete = async(req = request, res = response) => {
    const { id } = req.params;
    const indicator = await Indicator.findByIdAndDelete(id);
    res.json(indicator);
}

module.exports = { indicatorGet, indicatorPost, indicatorPut, indicatorDelete}