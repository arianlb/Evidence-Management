const { Schema, model } = require('mongoose');

const CriterionSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
});

module.exports = model('Criterion', CriterionSchema);