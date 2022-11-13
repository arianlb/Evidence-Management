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

router.get('/last', [], getLastOne);

router.get('/', [], yearsGet);

router.put('/', [], yearPut);

router.post('/', [], yearPost);

router.post('/new', [], newYearPost);

router.delete('/', [], yearDelete);

router.delete('/remove', [], removeOne);



module.exports = router;