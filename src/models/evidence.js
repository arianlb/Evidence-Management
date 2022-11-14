const { Schema, model } = require('mongoose');

const EvidenceSchema = Schema({
    description: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    file: {
        type: String
    },
    date: { type: Date, default: Date.now }
});

module.exports = model('Evidence', EvidenceSchema);