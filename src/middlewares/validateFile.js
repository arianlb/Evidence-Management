
const validateUpload = (req, res, next) => {
    
    if(!req.files || Object.keys(req.files).length === 0 || !req.files.file){
        return res.status(400).json({msg: 'No hay archivo que subir'});
    }

    next();
}

module.exports = { validateUpload }