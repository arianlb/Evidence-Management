const { Schema, model } = require('mongoose');

const PlanSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    }
});

module.exports = model('Plan', PlanSchema);