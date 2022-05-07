const { response } = require('express');

const Area = require('../models/area');

const areaGet = async(req, res = response) => {
    const { begin = 0, amount = 5 } = req.query;

    const [ total, areas ] = await Promise.all([
        Area.countDocuments(),
        Area.find().skip(Number(begin)).limit(Number(amount))
    ]);

    res.json({ total, areas });
}

const areaPost = async(req, res = response) => {
    const { name } = req.body;
    const area = new Area({ name });

    await area.save();
    res.json(area);
}

const areaPut = async(req, res = response) => {
    const { id } = req.params;
    const { name } = req.body;

    await Area.findByIdAndUpdate(id, name);

    res.json({ msg: 'Area actualizada' });
}

const areaDelete = async(req, res = response) => {
    const { id } = req.params;
    const areaD = await Area.findByIdAndDelete(id);
    res.json({ areaD });
}

module.exports = { areaGet, areaPost, areaPut, areaDelete }