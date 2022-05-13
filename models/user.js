const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    username: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    role: {
        type: String,
        required: true,
        emun: ['ROLE_ADMIN', 'ROLE_USER']
    },
    faculty: {
        type: String,
        required: [true, 'La facultad del usuario es obligatorio'],
    },
    department: {
        type: String
    },
    category: {
        type: String
    },
    evaluation: {
        type: Schema.Types.ObjectId,
        ref: 'Evaluation'
    },
    indicators: [{
        type: Schema.Types.ObjectId,
        ref: 'Indicator'
    }]
});

UserSchema.methods.toJSON = function(){
    const { __v, password, ...user } = this.toObject();
    return user;
}

module.exports = model('User', UserSchema);