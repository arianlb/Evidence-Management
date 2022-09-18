const { Router } = require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validateFields');
const { validateUpload } = require('../middlewares/validateFile');
const { validateToken } = require('../middlewares/validateJWT');
const { evidenceExistsById, indicatorExistsById } = require('../helpers/dbValidators');
const { evidenceGet,
        evidenceGetFile,
        evidencePost,
        evidencePut,
        evidenceDelete,
        evidenceUpload } = require('../controllers/evidenceController');

const router = Router();

router.get('/', [
    validateToken,
    validate
], evidenceGet);

router.get('/file/:id', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    validate
], evidenceGetFile);

router.post('/:id', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    check('description', 'La descripcion es obligatoria').notEmpty(),
    validate
], evidencePost);

router.put('/upload/:id', [
    validateToken,
    validateUpload,
    check('id', 'No es un ID valido').isMongoId(),
    validate
], evidenceUpload);

router.put('/:id', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    validate
], evidencePut);

router.delete('/:id/indicator/:idIndicator', [
    validateToken,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(evidenceExistsById),
    check('idIndicator', 'No es un ID valido').isMongoId(),
    check('idIndicator').custom(indicatorExistsById),
    validate
], evidenceDelete);

module.exports = router;