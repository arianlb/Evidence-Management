const { Router } = require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validateFields');
const { existsRole } = require('../helpers/dbValidators');
const { roleGet, rolePost, roleDelete } = require('../controllers/roleController');

const router = Router();

router.get('/', roleGet);

router.post('/', [
    check('role', 'El tipo de rol es obligatorio').notEmpty(),
    check('role').custom(existsRole),
    validate
], rolePost);

router.delete('/:id', roleDelete);

module.exports = router;