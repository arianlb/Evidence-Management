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
        throw new Error(`El id ${id} no exite en la BD`);
    }
}

module.exports = { 
    isRoleValid,
    usernameExists,
    existsRole,
    userExistsById
}