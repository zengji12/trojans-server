const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const https = require('https');
const fs = require('fs');
const busboy = require('connect-busboy');
require('dotenv').config();

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

// Start server
if (process.env.SSL_MODE === 'ON') {
    const httpsOptions = {
        key: fs.readFileSync(process.env.SSL_KEYPATH),
        cert: fs.readFileSync(process.env.SSL_CERTPATH),
        passphrase: 'reza'
    };

    const server = https.createServer(httpsOptions, app).listen(process.env.HTTPS_PORT, () => {
        console.log(`HTTPS Server is running on port ${process.env.HTTPS_PORT}`);
    });
} else {
    const PORT = process.env.HTTP_PORT || 3000;
    app.listen(PORT, () => {
        console.log(`HTTP Server is running on port ${PORT}`);
    });
}

process.on('SIGINT', () => { console.log("Bye bye!"); process.exit(); });

const {verify, decline, broadcast, sendLMSCred} = require('./app/controllers/verify.controller')
const { manualRegister } = require("./app/controllers/form.controller");