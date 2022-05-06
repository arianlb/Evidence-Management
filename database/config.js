const mongoose = require('mongoose');

const dbConnection = async() => {
    try{
        /*await mongoose.connect('mongodb://localhost:27017/nodedb', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });*/
        await mongoose.connect(process.env.MONGODB_CNN);
        console.log('Base de datos online');
    } catch (error){
        throw new Error('Error al conectar la BD');
    }
}




module.exports = { dbConnection }