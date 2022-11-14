const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const pino = require('pino-http');
const { createServer } = require('http');

const { dbConnection } = require('../database/config');
const { socketsController } = require('../controllers/socketController');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer(this.app);
        this.io = require('socket.io')(this.server, {
            cors: {
                origin: '*'
            }
        });

        this.connectDB();
        this.middlewares();
        this.routes();
        this.sockets();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            limits: { fileSize: 25 * 1024 * 1024 }
        }));
        this.app.use(pino({
            transport: {
                target: 'pino-pretty',
                options: {
                    translateTime: "SYS:standard",
                    ignore: "req.id,req.query,req.params,req.headers,req.remoteAddress,req.remotePort,res,err"
                }
            },
        }));
    }

    routes() {
        this.app.use('/api/areas', require('../routes/areaRouter'));
        this.app.use('/api/criterions', require('../routes/criterionRouter'));
        this.app.use('/api/evaluations', require('../routes/evaluationRouter'));
        this.app.use('/api/evidences', require('../routes/evidenceRouter'));
        this.app.use('/api/indicators', require('../routes/indicatorRouter'));
        this.app.use('/api/login', require('../routes/loginRouter'));
        this.app.use('/api/objectives', require('../routes/objetiveRouter'));
        this.app.use('/api/roles', require('../routes/roleRouter'));
        this.app.use('/api/users', require('../routes/userRouter'));
        this.app.use('/api/years', require('../routes/yearRouter'));
    }

    sockets() {
        this.io.on('connection', (socket) => socketsController(socket));
        this.app.set('io', this.io);
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor en puerto', this.port);
        })
    }
}

module.exports = Server; // Cambios Importantes despues de la expocion