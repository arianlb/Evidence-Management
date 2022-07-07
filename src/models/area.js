const { Schema, model } = require('mongoose');

const AreaSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    objectives: [{
        type: Schema.Types.ObjectId,
        ref: 'Objective'
    }],
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = model('Area', AreaSchema);