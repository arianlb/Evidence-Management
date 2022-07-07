const { Router } = require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validateFields');
const { login } = require('../controllers/loginController');

const router = Router();

router.post('/', [
    check('username', 'El username es obligatorio').notEmpty(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validate
], login);

module.exports = router;