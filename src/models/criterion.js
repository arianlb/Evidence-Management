const { Schema, model } = require('mongoose');

const CriterionSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    status: {
        type: String,
        default: 'No Cumplido'
    },
    todo: {
        type: Number,
        default: 5,
        min: 1
    },
    concluded: {
        type: Number,
        default: 0
    }
});

module.exports = model('Criterion', CriterionSchema);