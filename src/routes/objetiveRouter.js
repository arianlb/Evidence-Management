const { Router } = require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validateFields');
const { areaExistsById, objectiveExistsById } = require('../helpers/dbValidators');
const { addCriterions,
        objectiveGet, 
        objectivePost, 
        objectivePut, 
        objectiveDelete } = require('../controllers/objetiveController');

const router = Router();

router.get('/', objectiveGet);

router.post('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
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

router.delete('/:id/area/:idArea', [
    check('id', 'No es un ID valido').isMongoId(),
    check('idArea', 'No es un ID valido').isMongoId(),
    check('id').custom(objectiveExistsById),
    check('idArea').custom(areaExistsById),
    validate
], objectiveDelete);


module.exports = router;