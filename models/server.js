const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.connectDB();
        this.middlewares();
        this.routes();
    }

    async connectDB(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            limits: { fileSize: 25 * 1024 * 1024 }
        }));
    }

    routes(){
        this.app.use('/api/areas', require('../routes/areaRouter'));
        this.app.use('/api/criterions', require('../routes/criterionRouter'));
        this.app.use('/api/evaluations', require('../routes/evaluationRouter'));
        this.app.use('/api/evidences', require('../routes/evidenceRouter'));
        this.app.use('/api/indicators', require('../routes/indicatorRouter'));
        this.app.use('/api/login', require('../routes/loginRouter'));
        this.app.use('/api/objectives', require('../routes/objetiveRouter'));
        this.app.use('/api/roles', require('../routes/roleRouter'));
        this.app.use('/api/users', require('../routes/userRouter'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor en puerto', this.port);
        })
    }
}

module.exports = Server;