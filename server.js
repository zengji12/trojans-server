const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const https = require('https');
const fs = require('fs');
const busboy = require('connect-busboy');
require('dotenv').config();
const winston = require('winston');

const app = express();

const corsOptions = {
    origin: 'localhost',
    'Access-Control-Allow-Origin': 'localhost',
    withCredentials: false,
    'access-control-allow-credentials': true,
    credentials: false,
    optionSuccessStatus: 200,
}

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(busboy());

// Konfigurasi logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });
  
  // Middleware untuk menangkap log dari setiap permintaan
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

// Routes and other server logic go here
app.get("/", (req, res) => {
    res.json({
        message: "trojans-server"
    });
});

app.use(bodyParser.urlencoded({
    extended: true
}));

const db = require("./app/models");

db.sequelize.sync().then(() => {
    console.log('db synced');
}).catch(err => {
    console.log(err.message);
});

const cron = require('node-cron');
const fsExtra = require('fs-extra')

function clearJunk() {
    let path = './app/exports/'
    fsExtra.readdirSync(path)
        .filter(f => f.includes(".tmp"))
        .map(f => fsExtra.unlinkSync(path + f))
    fsExtra.readdirSync(path)
        .filter(f => !f.includes("."))
        .map(f => fsExtra.unlinkSync(path + f))
}

cron.schedule('0 0 * * *', function () {
    console.log('---------------------');
    console.log('Running Daily Cron Job');
    clearJunk()
});

require('./app/routes/form.routes')(app);
require('./app/routes/static.routes')(app);
require('./app/routes/admin.routes')(app);
require('./app/routes/auth.routes')(app);

// Start server
// if (process.env.SSL_MODE === 'ON') {
//     const httpsOptions = {
//         key: fs.readFileSync(process.env.SSL_KEYPATH),
//         cert: fs.readFileSync(process.env.SSL_CERTPATH),
//         passphrase: 'reza'
//     };

//     const server = https.createServer(httpsOptions, app).listen(process.env.HTTPS_PORT, () => {
//         console.log(`HTTPS Server is running on port ${process.env.HTTPS_PORT}`);
//     });
// } 

if (process.env.SSL_MODE=='ON') {
    var https_options = {
        key: fs.readFileSync(process.env.SSL_KEYPATH),
        cert: fs.readFileSync(process.env.SSL_CERTPATH),
        ca: [
            fs.readFileSync(process.env.SSL_CERTPATH),
            fs.readFileSync(process.env.SSL_CABUNDLEPATH)
        ]
    };
    const server = https.createServer(https_options, app).listen(process.env.HTTPS_PORT);
}

const PORT = process.env.HTTP_PORT || 8080;
app.listen(PORT, () => {
	console.log(`Trojans server is running on ${PORT}.`);
});

process.on('SIGINT', () => { console.log("Bye bye!"); process.exit(); });

const {verify, decline, broadcast, sendLMSCred} = require('./app/controllers/verify.controller')
const { manualRegister } = require("./app/controllers/form.controller");