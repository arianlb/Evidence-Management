const { Schema, model } = require('mongoose');

const IndicatorSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    criterion: {
        type: Schema.Types.ObjectId,
        ref: 'Criterion'
    },
    evidences: [{
        type: Schema.Types.ObjectId,
        ref: 'Evidence'
    }]
});

module.exports = model('Indicator', IndicatorSchema);