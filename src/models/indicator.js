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
    category: {
        type: String,
        required: [true, 'La categoria es obligatorio']
    },
    model: {
        type: Boolean,
        default: true
    },
    department: {
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

IndicatorSchema.methods.toJSON = function(){
    const { __v, model, department, ...indicator } = this.toObject();
    return indicator;
}

module.exports = model('Indicator', IndicatorSchema);