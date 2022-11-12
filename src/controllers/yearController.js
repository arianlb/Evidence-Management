const { request, response } = require('express');

const Year = require('../models/year');

const getLastOne = async (req, res = response) => { 
    try {
        const year = await Year.findOne();
        const lastYear = year.years[year.years.length - 1];
        res.json(lastYear);
        req.log.info('Obtuvo el ultimo Año');
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const yearsGet = async (req, res = response) => {
    try {
        const year = await Year.findOne();
        res.json(year);
        req.log.info('Obtuvo todos los Años');
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const yearPut = async (req, res = response) => { 
    try {
        const { year } = req.body;
        const yearDB = await Year.findOne();
        yearDB.years.push(year);
        await yearDB.save();
        res.json(year);
        req.log.info('Actualizo un Año');
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const yearPost = async (req, res = response) => {
    try {

        const yearDB = await Year.findOne();
        if (yearDB) {
            req.log.warn('Ya existe una lista de años');
            return res.status(400).json({ msg: 'Ya existe una lista de años' });
        }

        const { years } = req.body;
        const year = new Year({ years });
        await year.save();
        res.json(year);
        req.log.info('Agrego una lista de Años');
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const yearDelete = async (req, res = response) => { 
    try {
        const year = await Year.findOneAndDelete();
        res.json(year);
        req.log.info('Elimino la lista de Años');
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const removeOne = async (req, res = response) => { 
    try {
        const year = await Year.findOne();
        const yearDB = year.years.filter(y => y !== req.query.year);
        year.years = yearDB;
        await year.save();
        res.json(year);
        req.log.info('Elimino un Año');
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

module.exports = { getLastOne, yearsGet, yearPost, yearPut, yearDelete, removeOne };