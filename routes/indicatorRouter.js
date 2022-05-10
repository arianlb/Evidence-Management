const { Router } = require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validateFields');
const { existsRole } = require('../helpers/dbValidators');
const { indicatorGet,
        indicatorPost,
        indicatorPut,
        indicatorDelete } = require('../controllers/indicatorController');

const router = Router();

router.get('/', indicatorGet);

router.post('/', [
    check('name', 'El nombre es obligatorio').notEmpty(),
    validate
], indicatorPost);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    validate
], indicatorPut);

router.delete('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    validate
], indicatorDelete);

module.exports = router;