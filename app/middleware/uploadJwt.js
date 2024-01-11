const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const config = require("../configs/auth.config.js");

// Middleware untuk verifikasi token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.username = decoded.username;
        next();
    });
};

// Multer untuk menangani pengunggahan file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'exports'));
    },
    filename: (req, file, cb) => {
        const date = Date.now();
        const ext = file.mimetype.split('/')[1];
        const newFilename = `${req.username}_${date}.${ext}`;
        cb(null, newFilename);
    }
});

const upload = multer({ storage: storage });

module.exports = { upload, verifyToken };
