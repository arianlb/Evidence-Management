const jsonwebtoken = require('jsonwebtoken');

const jwt = (uid = '', role = '', name = '', username = '') => {

    return new Promise( (resolve, reject) => {
        const payload = { uid, role, name, username };
        jsonwebtoken.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {
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