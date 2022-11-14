const { Schema, model } = require('mongoose');

const EvaluationSchema = Schema({
    year: { type: Number, required: [true, 'El año es obligatorio'] },
    categories: {
        type: Map,
        of: String
    },
    total: {
        type: String,
        default: 'Excelente'
    }
});

module.exports = model('Evaluation', EvaluationSchema);