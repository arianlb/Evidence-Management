const { Schema, model } = require('mongoose');

const IndicatorSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    }
});

module.exports = model('Indicator', IndicatorSchema);