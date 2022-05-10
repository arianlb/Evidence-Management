const { Schema, model } = require('mongoose');

const EvidenceSchema = Schema({
    description: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    }
});

module.exports = model('Evidence', EvidenceSchema);