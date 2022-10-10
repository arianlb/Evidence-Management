const { Router } = require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validateFields');
const { validateToken } = require('../middlewares/validateJWT');
const { hasAnyRole } = require('../middlewares/validateRole');
const { indicatorsRequest } = require('../middlewares/validateIndicators');
const { userExistsById, indicatorExistsById } = require('../helpers/dbValidators');
const { indicatorByCategory,
    indicatorById,
    indicatorsByUser,
    indicatorGet,
    indicatorPost,
    indicatorPostByCriterion,
    personalIndicatorPost,
    indicatorPut,
    indicatorDelete,
    indicatorModelDelete } = require('../controllers/indicatorController');

const router = Router();

router.get('/', [
    validateToken,
    validate
], indicatorGet);

router.get('/category', [
    validateToken,
    hasAnyRole('ROLE_CHIEF'),
    validate
], indicatorByCategory);

router.get('/:id', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    validate
], indicatorById);

router.get('/user/:id', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    validate
], indicatorsByUser);

router.post('/:id', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    indicatorsRequest,
    validate
], indicatorPost);

router.post('/criterion/:id', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('category', 'La categoria es obligatorio').notEmpty(),
    validate
], indicatorPostByCriterion);

router.post('/personal/:id', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('category', 'La categoria es obligatorio').notEmpty(),
    validate
], personalIndicatorPost);

router.put('/:id', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    validate
], indicatorPut);

router.delete('/:id/user/:idUser', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(indicatorExistsById),
    check('idUser', 'No es un ID valido').isMongoId(),
    check('idUser').custom(userExistsById),
    validate
], indicatorDelete);

router.delete('/:id', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    validate
], indicatorModelDelete);

module.exports = router;