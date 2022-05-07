const { Schema, model } = require('mongoose');

const ObjectiveSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    }
});

module.exports = model('Objective', ObjectiveSchema);