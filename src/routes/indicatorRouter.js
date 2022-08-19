const { Router } = require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validateFields');
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

router.get('/', indicatorGet);

router.get('/category', indicatorByCategory);

router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    validate
], indicatorById);

router.get('/user/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(userExistsById),
    validate
], indicatorsByUser);

router.post('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    indicatorsRequest,
    validate
], indicatorPost);

router.post('/criterion/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('category', 'La categoria es obligatorio').notEmpty(),
    validate
], indicatorPostByCriterion);

router.post('/personal/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('category', 'La categoria es obligatorio').notEmpty(),
    validate
], personalIndicatorPost);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    validate
], indicatorPut);

router.delete('/:id/user/:idUser', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(indicatorExistsById),
    check('idUser', 'No es un ID valido').isMongoId(),
    check('idUser').custom(userExistsById),
    validate
], indicatorDelete);

router.delete('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    validate
], indicatorModelDelete);

module.exports = router;