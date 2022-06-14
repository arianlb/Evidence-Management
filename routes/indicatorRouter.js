const { Router } = require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validateFields');
//const { criterionExistsById } = require('../helpers/dbValidators');
const { indicatorByCategory,
        indicatorById,
        indicatorGet,
        indicatorPost,
        indicatorPostByCriterion,
        indicatorPut,
        indicatorDelete } = require('../controllers/indicatorController');

const router = Router();

router.get('/', indicatorGet);

router.get('/category', indicatorByCategory);

router.get('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    validate
], indicatorById);

router.post('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('category', 'La categoria es obligatorio').notEmpty(),
    validate
], indicatorPost);

router.post('/criterion/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('category', 'La categoria es obligatorio').notEmpty(),
    validate
], indicatorPostByCriterion);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    validate
], indicatorPut);

router.delete('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    validate
], indicatorDelete);

module.exports = router;