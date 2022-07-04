const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        req.log.warn(errors.errors[0].msg);
        return res.status(400).json(errors);
    }

    next();
}

module.exports = {
    validate
}