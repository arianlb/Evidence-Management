const jsonwebtoken = require('jsonwebtoken');

const jwt = (uid = '', role = '', name = '', username = '', department = '') => {

    return new Promise( (resolve, reject) => {
        const payload = { uid, role, name, username, department };
        jsonwebtoken.sign(payload, process.env.SECRETORPRIVATEKEY, (err, token) => {
            if(err){
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        });

    });
}

module.exports = {
    jwt
}