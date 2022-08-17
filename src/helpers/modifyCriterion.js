const Criterion = require('../models/criterion');

const updateCriterion = async (id, value = 0) => {
    const criterion = await Criterion.findById(id);
    if (criterion) {
        criterion.concluded += value;
        if (criterion.concluded > criterion.todo) {
            criterion.status = 'Sobre Cumplido';
        }
        else if (criterion.concluded == criterion.todo) {
            criterion.status = 'Cumplido';
        }
        else if (criterion.concluded < criterion.todo) {
            criterion.status = 'No Cumplido';
        }
        await criterion.save();
    }
}

module.exports = { updateCriterion }