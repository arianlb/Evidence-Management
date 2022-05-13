const { Schema, model } = require('mongoose');

const IndicatorSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    status: {
        type: Boolean,
        default: false
    },
    observation: {
        type: String
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