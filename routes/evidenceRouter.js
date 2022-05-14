const { Router } = require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validateFields');
const { validateUpload } = require('../middlewares/validateFile');
//const { existsRole } = require('../helpers/dbValidators');
const { evidenceGet,
        evidenceGetFile,
        evidencePost,
        evidencePut,
        evidenceDelete,
        evidenceUpload } = require('../controllers/evidenceController');

const router = Router();

router.get('/', evidenceGet);

router.get('/file/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    validate
], evidenceGetFile);

router.post('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('description', 'La descripcion es obligatoria').notEmpty(),
    validate
], evidencePost);

router.put('/upload/:id', [
    validateUpload,
    check('id', 'No es un ID valido').isMongoId(),
    validate
], evidenceUpload);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    validate
], evidencePut);

router.delete('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    validate
], evidenceDelete);

module.exports = router;