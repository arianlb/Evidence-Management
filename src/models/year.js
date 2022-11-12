const { Schema, model } = require('mongoose');

const YearSchema = Schema({
    years: [{ type: Number, required: true }],
});

module.exports = model('Year', YearSchema);