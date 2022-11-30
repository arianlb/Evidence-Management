const Area = require('../models/area');
const Criterion = require('../models/criterion');
const Evaluation = require('../models/evaluation');
const Evidence = require('../models/evidence');
const Indicator = require('../models/indicator');
const Objective = require('../models/objective');
const Role = require('../models/role');
const User = require('../models/user');

const isRoleValid = async(role = '') => {
    const roleExists = await Role.findOne({role});
    if(!roleExists){
        throw new Error(`El rol ${role} no esta registrado`);
    }
}

const usernameExists = async(username = '') => {
    const exists = await User.findOne({username});
    if(exists){
        throw new Error(`El nombre de usuario ${username} ya existe en la BD`);
    }
}

const existsRole = async(role = '') => {
    const roleExists = await Role.findOne({role});
    if(roleExists){
        throw new Error(`El rol ${role} ya esta registrado en la Bd`);
    }
}

const userExistsById = async( id ) => {
    const exists = await User.findById(id);
    if(!exists){
        throw new Error(`El Usuario con el id: ${id} no exite en la BD`);
    }
}

const areaNameExists = async (name = '') => {
    const exists = await Area.findOne({name, year});
    if(exists){
        throw new Error(`El nombre del area ${name} ya existe en la BD`);
    }
}

const areaExistsById = async( id ) => {
    const exists = await Area.findById(id);
    if(!exists){
        throw new Error(`El Area con el id: ${id} no exite en la BD`);
    }
}

const criterionExistsById = async( id ) => {
    const exists = await Criterion.findById(id);
    if(!exists){
        throw new Error(`El Criterio con el id: ${id} no exite en la BD`);
    }
}

const evaluationExistsById = async (id) => {
    const exists = await Evaluation.findById(id);
    if (!exists) {
        throw new Error(`La Evaluacion con el id: ${id} no exite en la BD`);
    }
}

const evidenceExistsById = async( id ) => {
    const exists = await Evidence.findById(id);
    if(!exists){
        throw new Error(`La Evidencia con el id: ${id} no exite en la BD`);
    }
}

const indicatorExistsById = async( id ) => {
    const exists = await Indicator.findById(id);
    if(!exists){
        throw new Error(`El Indicador con el id: ${id} no exite en la BD`);
    }
}

const objectiveExistsById = async( id ) => {
    const exists = await Objective.findById(id);
    if(!exists){
        throw new Error(`El Objetivo con el id: ${id} no exite en la BD`);
    }
}

module.exports = { 
    areaExistsById,
    areaNameExists,
    criterionExistsById,
    evaluationExistsById,
    evidenceExistsById,
    existsRole,
    indicatorExistsById,
    isRoleValid,
    objectiveExistsById,
    userExistsById,
    usernameExists,
}