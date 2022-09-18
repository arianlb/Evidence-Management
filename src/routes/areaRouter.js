const { Router } = require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validateFields');
const { validateToken } = require('../middlewares/validateJWT');
const { areaNameExists, areaExistsById } = require('../helpers/dbValidators');
const { areaGet,
        areaPost,
        areaById,
        areaPut,
        areaDelete,
        addObjectives,
        addUsers } = require('../controllers/areaController');

const router = Router();

router.get('/', [
    validateToken,
    validate
], areaGet);

router.get('/:id', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(areaExistsById),
    validate
], areaById);

router.post('/', [
    validateToken,
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('name').custom(areaNameExists),
    validate
], areaPost);

router.put('/:id', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(areaExistsById),
    validate
], areaPut);

router.put('/add/objectives/:id', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    validate
], addObjectives);

router.put('/add/users/:id', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    validate
], addUsers);

router.delete('/:id', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(areaExistsById),
    validate
], areaDelete);


module.exports = router;