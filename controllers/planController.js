const { request, response} = require('express');

const Plan = require('../models/plan');

const planGet = async(req = request, res = response) => {
    
    const { begin = 0, amount = 5} = req.query;

    const [ total, plan ] = await Promise.all([
        Plan.countDocuments(),
        Plan.find().skip(Number(begin)).limit(Number(amount))
    ]);

    res.json({
        total,
        plan
    });
}

const planPost = async(req = request, res = response) => {

    const { name } = req.body;
    const plan = new Plan({ name });

    await plan.save();

    res.json(plan);
}

const planPut = async(req = request, res = response) => {
    const { id } = req.params;
    const { name } = req.body;

    await Plan.findByIdAndUpdate(id, name);
    
    res.json({
        msg: 'Plan actualizado',
    });
}

const planDelete = async(req = request, res = response) => {
    const { id } = req.params;
    const plan = await Plan.findByIdAndDelete(id);
    res.json(plan);
}

module.exports = { planGet, planPost, planPut, planDelete}