const { Router } = require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validateFields');
const { existsRole } = require('../helpers/dbValidators');
const { planGet, planPost, planPut, planDelete } = require('../controllers/planController');

const router = Router();

router.get('/', planGet);

router.post('/', [
    check('name', 'El nombre es obligatorio').notEmpty(),
    validate
], planPost);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    validate
], planPut);

router.delete('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    validate
], planDelete);

module.exports = router;