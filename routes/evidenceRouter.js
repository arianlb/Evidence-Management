const { Router } = require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validateFields');
const { existsRole } = require('../helpers/dbValidators');
const { evidenceGet,
        evidencePost,
        evidencePut,
        evidenceDelete } = require('../controllers/evidenceController');

const router = Router();

router.get('/', evidenceGet);

router.post('/', [
    check('name', 'El nombre es obligatorio').notEmpty(),
    validate
], evidencePost);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    validate
], evidencePut);

router.delete('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    validate
], evidenceDelete);

module.exports = router;