const { Router } = require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validateFields');
const { existsRole } = require('../helpers/dbValidators');
const { addCriterions,
        objectiveGet, 
        objectivePost, 
        objectivePut, 
        objectiveDelete } = require('../controllers/objetiveController');

const router = Router();

router.get('/', objectiveGet);

router.post('/', [
    check('name', 'El nombre es obligatorio').notEmpty(),
    validate
], objectivePost);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    validate
], objectivePut);

router.put('/add/criterions/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    validate
], addCriterions);

router.delete('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    validate
], objectiveDelete);


module.exports = router;