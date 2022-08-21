const { Router } = require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validateFields');
const { validateToken } = require('../middlewares/validateJWT');
const { hasAnyRole } = require('../middlewares/validateRole');
const { isRoleValid, usernameExists, userExistsById } = require('../helpers/dbValidators');
const { userGet, userEvaluationGet, userNotificationsGet, userPost, userPut, userDelete } = require('../controllers/userController');


const router = Router();

router.get('/', userGet);

router.get('/evaluation/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    validate
], userEvaluationGet);

router.get('/notification/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    validate
], userNotificationsGet);

router.post('/', [
    check('name', 'El nombre obligatorio').notEmpty(),
    check('username', 'El username es obligatorio').notEmpty(),
    check('username').custom(usernameExists),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    check('role').custom(isRoleValid),
    check('faculty', 'La facultad es obligatoria').notEmpty(),
    validate
], userPost);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(userExistsById),
    check('role').custom(isRoleValid),
    validate
], userPut);

router.delete('/:id', [
    /*validateToken,
    hasAnyRole('USER_ROLE', 'SUPER_ROLE'),*/
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(userExistsById),
    validate
], userDelete);


module.exports = router;