const { request, response } = require('express');

const { createAllNew } = require('../helpers/areaTools');
const { deleteArea } = require('../helpers/removeModels');
const Area = require('../models/area');
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

const newYearPost = async (req, res = response) => {
    try {
        const year = await Year.findOne();
        for(let i = 0; i < year.years.length; i++) {
            if(year.years[i] === Number(req.body.year)) {
                return res.status(400).json({ msg: 'El año ya existe' });
            }
        }
        
        const lastYear = year.years[year.years.length - 1];
        year.years.push(req.body.year);
        const [, areas] = await Promise.all([
            year.save(),
            createAllNew(lastYear, req.body.year)
        ]);
        res.json(areas);
        req.log.info('Agrego un Año');
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const yearsGet = async (req, res = response) => {
    try {
        const year = await Year.findOne();
        res.json(year.years);
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
        const yearDB = year.years.filter(y => y != req.query.year);
        year.years = yearDB;
        const [, areas] = await Promise.all([
            year.save(),
            Area.find({ year: req.query.year })
        ]);
        if (areas) {
            for (area of areas) {
                await deleteArea(area._id);
            }
        }
        res.json(year);
        req.log.info('Elimino un Año');
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const yearDepartamentGet = async (req, res = response) => { 
    try {
        const yearDB = await Year.findOne();
        res.json(yearDB.departments);
        req.log.info('Obtuvo los Departamentos');
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const yearDepartamentPut = async (req, res = response) => { 
    try {
        const { department } = req.body;
        const yearDB = await Year.findOne();
        for (depart of yearDB.departments) {
            if (depart === department) { 
                req.log.warn('Ya existe el departamento');
                return res.status(400).json({ msg: 'Ya existe el departamento' });
            }
        }
        yearDB.departments.push(department);
        await yearDB.save();
        res.json(department);
        req.log.info('Actualizo un Departamento');
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

const yearDepartamentDelete = async (req, res = response) => { 
    try {
        const department = req.params.department;
        const yearDB = await Year.findOne();
        const departments = yearDB.departments.filter(d => d != department);
        yearDB.departments = departments;
        await yearDB.save();
        res.json(department);
        req.log.info('Elimino el Departamento ', department);
    } catch (error) {
        res.status(500).json({ msg: error.message });
        req.log.error(error.message);
    }
}

module.exports = { getLastOne, newYearPost, yearsGet, yearPost, yearPut, yearDelete, removeOne, yearDepartamentGet, yearDepartamentPut, yearDepartamentDelete };