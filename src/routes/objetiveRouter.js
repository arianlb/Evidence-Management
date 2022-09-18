const { Router } = require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validateFields');
const { validateToken } = require('../middlewares/validateJWT');
const { areaExistsById, objectiveExistsById } = require('../helpers/dbValidators');
const { addCriterions,
        objectiveGet, 
        objectivePost, 
        objectivePut, 
        objectiveDelete } = require('../controllers/objetiveController');

const router = Router();

router.get('/', [
    validateToken,
    validate
], objectiveGet);

router.post('/:id', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    check('name', 'El nombre es obligatorio').notEmpty(),
    validate
], objectivePost);

router.put('/:id', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    validate
], objectivePut);

router.put('/add/criterions/:id', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    validate
], addCriterions);

router.delete('/:id/area/:idArea', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    check('idArea', 'No es un ID valido').isMongoId(),
    check('id').custom(objectiveExistsById),
    check('idArea').custom(areaExistsById),
    validate
], objectiveDelete);


module.exports = router;