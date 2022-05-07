const { Schema, model } = require('mongoose');

const PlanSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    indicators: [{
        type: Schema.Types.ObjectId,
        ref: 'Indicator'
    }]
});

module.exports = model('Plan', PlanSchema);