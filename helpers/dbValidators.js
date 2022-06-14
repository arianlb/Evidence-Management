const Area = require('../models/area');
const Role = require('../models/role');
const User = require('../models/user');
const Criterion = require('../models/criterion');

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
        throw new Error(`El id ${id} no exite en la BD`);
    }
}

const areaNameExists = async(name = '') => {
    const exists = await Area.findOne({name});
    if(exists){
        throw new Error(`El nombre del area ${name} ya existe en la BD`);
    }
}

const areaExistsById = async( id ) => {
    const exists = await Area.findById(id);
    if(!exists){
        throw new Error(`El id ${id} no exite en la BD`);
    }
}

const criterionExistsById = async( id ) => {
    const exists = await Criterion.findById(id);
    if(!exists){
        throw new Error(`El id ${id} no exite en la BD`);
    }
}

module.exports = { 
    areaExistsById,
    areaNameExists,
    criterionExistsById,
    existsRole,
    isRoleValid,
    userExistsById,
    usernameExists,
}