const { Router } = require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validateFields');
const { areaNameExists, areaExistsById } = require('../helpers/dbValidators');
const { areaGet,
        areaPost,
        areaById,
        areaPut,
        areaDelete,
        addObjectives,
        addUsers } = require('../controllers/areaController');

const router = Router();

router.get('/', areaGet);

router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(areaExistsById),
    validate
], areaById);

router.post('/', [
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('name').custom(areaNameExists),
    validate
], areaPost);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(areaExistsById),
    validate
], areaPut);

router.put('/add/objectives/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    validate
], addObjectives);

router.put('/add/users/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    validate
], addUsers);

router.delete('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(areaExistsById),
    validate
], areaDelete);


module.exports = router;