const { Schema, model } = require('mongoose');

const AreaSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    }
});

module.exports = model('Area', AreaSchema);