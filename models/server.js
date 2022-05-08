const express = require('express');
const cors = require('cors');

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
    }

    routes(){
        this.app.use('/api/areas', require('../routes/areaRouter'));
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