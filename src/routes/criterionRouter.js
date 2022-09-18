const { Router } = require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validateFields');
const { validateToken } = require('../middlewares/validateJWT');
const { criterionExistsById, objectiveExistsById } = require('../helpers/dbValidators');
const { criterionGet,
        criterionPost,
        criterionPut,
        criterionDelete } = require('../controllers/criterionController');
const objective = require('../models/objective');

const router = Router();

router.get('/', [
    validateToken,
    validate
], criterionGet);

router.post('/:id', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    check('name', 'El nombre es obligatorio').notEmpty(),
    validate
], criterionPost);

router.put('/:id', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    validate
], criterionPut);

router.delete('/:id/objective/:idObjective', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    check('idObjective', 'No es un ID valido').isMongoId(),
    check('id').custom(criterionExistsById),
    check('idObjective').custom(objectiveExistsById),
    validate
], criterionDelete);

module.exports = router;