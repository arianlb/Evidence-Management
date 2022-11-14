const { Router } = require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validateFields');
const { validateToken } = require('../middlewares/validateJWT');
const { hasAnyRole } = require('../middlewares/validateRole');
const { userExistsById, evaluationExistsById } = require('../helpers/dbValidators');

const { evaluationGet, evaluationPost, evaluationPut, evaluationDelete } = require('../controllers/evaluationController');


const router = Router();

router.get('/', [
    validateToken,
    //hasAnyRole('ADMIN_ROLE', 'USER_ROLE'),
    validate
], evaluationGet);

router.post('/', [
    validateToken,
    //hasAnyRole('ADMIN_ROLE', 'USER_ROLE'),
    check('year', 'El año es obligatorio').notEmpty(),
    validate
], evaluationPost);

router.put('/:id', [
    validateToken,
    //hasAnyRole('ADMIN_ROLE', 'USER_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    validate
], evaluationPut);

router.delete('/:id/user/:idUser', [
    validateToken,
    //hasAnyRole('ADMIN_ROLE', 'USER_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('idUser', 'No es un ID valido').isMongoId(),
    check('id').custom(evaluationExistsById),
    check('idUser').custom(userExistsById),
    validate
], evaluationDelete);