const { Schema, model } = require('mongoose');

const CriterionSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    objectives: [{
        type: Schema.Types.ObjectId,
        ref: 'Objective'
    }]
});

module.exports = model('Criterion', CriterionSchema);