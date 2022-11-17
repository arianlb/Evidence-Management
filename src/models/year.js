const { Schema, model } = require('mongoose');

const YearSchema = Schema({
    years: [{ type: Number, required: true }],
    departments: [{ type: String }]
});

module.exports = model('Year', YearSchema);