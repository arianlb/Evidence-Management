const { Router } = require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validateFields');
const { existsRole } = require('../helpers/dbValidators');
const { evaluationGet,
        evaluationPost,
        evaluationPut,
        evaluationDelete } = require('../controllers/evaluationController');

const router = Router();

router.get('/', evaluationGet);

router.post('/', [
check('name', 'El nombre es obligatorio').notEmpty(),
validate
], evaluationPost);

router.put('/:id', [
check('id', 'No es un ID valido').isMongoId(),
validate
], evaluationPut);

router.delete('/:id', [
check('id', 'No es un ID valido').isMongoId(),
validate
], evaluationDelete);

module.exports = router;