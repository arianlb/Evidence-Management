const { Router } = require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validateFields');
const { validateToken } = require('../middlewares/validateJWT');
const { getLastOne,
        newYearPost,
        yearsGet,
        yearPut,
        yearPost,
        yearDelete,
        removeOne } = require('../controllers/yearController');

const router = Router();

router.get('/last', [
    validateToken,
    validate
], getLastOne);

router.get('/', [
    validateToken,
    validate
], yearsGet);

router.put('/', [
    validateToken,
    check('year', 'El año es obligatorio').notEmpty(),
    validate
], yearPut);

router.post('/', [
    validateToken,
    validate
], yearPost);

router.post('/new', [
    validateToken,
    check('year', 'El año es obligatorio').notEmpty(),
    validate
], newYearPost);

router.delete('/', [
    validateToken,
    validate
], yearDelete);

router.delete('/remove', [
    validateToken,
    validate
], removeOne);



module.exports = router;