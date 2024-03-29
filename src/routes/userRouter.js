const { Router } = require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validateFields');
const { validateToken } = require('../middlewares/validateJWT');
const { hasAnyRole } = require('../middlewares/validateRole');
const { isRoleValid, usernameExists, userExistsById } = require('../helpers/dbValidators');
const { changePassword, userGet, userEvaluationGet, userNotificationsGet, userPost, userPut, userDelete } = require('../controllers/userController');


const router = Router();

router.get('/', [
    validateToken,
    hasAnyRole('ROLE_CHIEFA', 'ROLE_ADMIN', 'ROLE_CHIEFD'),
    validate
], userGet);

router.get('/evaluation/:id', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    validate
], userEvaluationGet);

router.get('/notification/:id', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    validate
], userNotificationsGet);

router.post('/', [
    validateToken,
    hasAnyRole('ROLE_ADMIN'),
    check('name', 'El nombre obligatorio').notEmpty(),
    check('username', 'El username es obligatorio').notEmpty(),
    check('username').custom(usernameExists),
    check('role').custom(isRoleValid),
    check('faculty', 'La facultad es obligatoria').notEmpty(),
    validate
], userPost);

router.put('/:id', [
    validateToken,
    hasAnyRole('ROLE_ADMIN'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(userExistsById),
    check('role').custom(isRoleValid),
    validate
], userPut);

router.put('/change/password', [
    validateToken,
    check('oldpassword', 'La contraseña antigua es obligatorio').notEmpty(),
    check('newpassword', 'La contraseña nueva es obligatorio').notEmpty(),
    validate
], changePassword);

router.delete('/:id', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(userExistsById),
    validate
], userDelete);


module.exports = router;