const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config.js");
const db = require("../models");
const Admin = db.admin;

verifyToken = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    token = token.split(' ')[1];

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.npm = decoded.npm;
        next();
    });
};

const authJwt = {
    verifyToken: verifyToken
};
module.exports = authJwt;
