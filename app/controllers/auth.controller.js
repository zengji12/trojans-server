const db = require("../models");
const config = require("../configs/auth.config.js");
const Admin = db.admin;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { validationResult } = require('express-validator');

exports.signin = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).send({ message: "Invalid input", errors: errors.array() })
    }

    Admin.findOne({
        where: {
            npm: req.body.npm
        }
    }).then(admin => {
        if (!admin) {
            return res.status(401).send({ message: "Invalid npm or password!" });
        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.password + req.body.npm,
            admin.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid npm or password!"
            });
        } else {
            var token = jwt.sign({ npm: admin.npm }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            res.status(200).send({
                npm: admin.npm,
                accessToken: token
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).send({ message: err.message });
    });
};

exports.refreshToken = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).send({ message: "Invalid input", errors: errors.array() })
    }
    let token = req.headers.authorization;
    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    token = token.split(' ')[1];

    jwt.verify(token, config.secret, { ignoreExpiration: true }, (err, decoded) => {
        if (err || !decoded.npm) {
            return res.status(403).send({
                message: "Invalid token!"
            });
        }
        Admin.findOne({
            where: {
                npm: decoded.npm
            }
        }).then(admin => {
            if (!admin) {
                return res.status(404).send({ message: "Admin Not found." });
            }

            var token = jwt.sign({ npm: admin.npm }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            res.status(200).send({
                npm: admin.npm,
                accessToken: token
            });

        }).catch(err => {
            console.log(err);
            res.status(500).send({ message: err.message });
        });
    });

};

exports.resetPassword = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).send({ message: "Invalid input", errors: errors.array() })
    }
    Admin.findOne({
        where: {
            npm: req.body.npm
        }
    }).then(admin => {
        if (!admin) {
            return res.status(404).send({ message: "Admin Not found." });
        }
        Admin.update({
            password: bcrypt.hashSync("5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8" + req.body.npm, 8)
        }, {
            where: { npm: req.body.npm }
        }).then(admin => {
            console.log(`[auth password reset][${new Date()}] ${req.npm} reser password of ${req.body.npm}`);
            res.send({ message: "Password reset successfully!" });
        }).catch(err => {
            res.status(500).send({ message: err.message });
        });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

exports.resetPasswordServer = (npm) => {
    Admin.findOne({
        where: {
            npm: npm
        }
    }).then(admin => {
        Admin.update({
            password: bcrypt.hashSync("5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8" + npm, 8)
        }, {
            where: { npm: npm }
        }).then(admin => {
            console.log(`[auth password reset][${new Date()}] server reser password of ${npm}`);
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    });
};
