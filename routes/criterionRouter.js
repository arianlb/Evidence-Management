const { Router } = require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validateFields');
//const { existsRole } = require('../helpers/dbValidators');
const { criterionGet,
        criterionPost,
        criterionPut,
        criterionDelete } = require('../controllers/criterionController');

const router = Router();

router.get('/', criterionGet);

router.post('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('name', 'El nombre es obligatorio').notEmpty(),
    validate
], criterionPost);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    validate
], criterionPut);

router.delete('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    validate
], criterionDelete);

module.exports = router;