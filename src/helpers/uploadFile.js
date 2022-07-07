const path = require('path');
const { v4: uuidv4 } = require('uuid');

const upload = (file) => {

    return new Promise((resolve, reject) => {
        
        const cutName = file.name.split('.');
        const newName = uuidv4() + '.' + cutName[cutName.length-1];
        const uploadPath = path.join(__dirname, '../../uploads/evidences/', newName);

        file.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve(newName);
        });

    });
    
}

module.exports = { upload }