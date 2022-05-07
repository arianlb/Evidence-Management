const { Schema, model } = require('mongoose');

const EvaluationSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    }
});

module.exports = model('Evaluation', EvaluationSchema);