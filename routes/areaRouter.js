const { Router } = require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validateFields');
const { existsRole } = require('../helpers/dbValidators');
const { areaGet, areaPost, areaPut, areaDelete } = require('../controllers/areaController');

const router = Router();

router.get('/', areaGet);

router.post('/', areaPost);

router.put('/:id', areaPut);

router.delete('/:id', areaDelete);


module.exports = router;