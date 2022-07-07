const { Schema, model } = require('mongoose');

const ObjectiveSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    criterions: [{
        type: Schema.Types.ObjectId,
        ref: 'Criterion'
    }]
});

module.exports = model('Objective', ObjectiveSchema);