// auth.controller.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config");
const db = require("../models");
const Responses = db.responses;
const Account = db.accounts;
const { validationResult } = require('express-validator');
const { upload, verifyToken } = require('../middleware/uploadJwt');  // Sesuaikan dengan lokasi file Anda


exports.signinUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Account.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: "Username not found" });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, config.secret, {
      expiresIn: 86400, // 24 jam
    });

    res.status(200).json({ 
        username: user.username,
        accessToken: token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.refreshTokenUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ message: "Invalid input", errors: errors.array() });
  }

  let token = req.headers.authorization;
  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  token = token.split(" ")[1];

  jwt.verify(token, config.secret, { ignoreExpiration: true }, (err, decoded) => {
    if (err || !decoded.username) {
      return res.status(403).send({
        message: "Invalid token!",
      });
    }

    Account.findOne({
      where: {
        username: decoded.username,
      },
    })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: "Account not found." });
        }

        const newToken = jwt.sign({ username: user.username }, config.secret, {
          expiresIn: 86400, // 24 hours
        });

            res.status(200).send({
              username: user.username,
              accessToken: newToken,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send({ message: err.message });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ message: err.message });
      });
};

exports.changePasswordUser = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ message: "Invalid input", errors: errors.array() });
    }

    let token = req.headers.authorization;
    if (!token) {
        return res.status(403).send({
            message: "No token provided!",
        });
    }

    token = token.split(" ")[1];

    jwt.verify(token, config.secret, { ignoreExpiration: true }, (err, decoded) => {
        if (err || !decoded.username) {
            return res.status(403).send({
                message: "Invalid token!",
            });
        }

        Account.findOne({
            where: {
                username: decoded.username,
            },
        }).then(user => {
            if (!user) {
                return res.status(401).send({ message: "Account Not found." });
            }
            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            } else {
                Account.update({
                    password: bcrypt.hashSync(req.body.newPassword, 8)
                }, {
                    where: { username: decoded.username }  // Ganti req.username menjadi decoded.username
                }).then(user => {
                    console.log(`[auth password change][${new Date()}] ${decoded.username} change password`);
                    res.send({ message: "Password changed successfully!" });
                }).catch(err => {
                    res.status(500).send({ message: err.message });
                });
            }
        }).catch(err => {
            res.status(500).send({ message: err.message });
        });
    });
};

exports.dashboard = (req, res) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    token = token.split(' ')[1];

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err || !decoded.username) {
            return res.status(403).send({
                message: "Invalid token!"
            });
        }

        Account.findOne({
            where: {
                username: decoded.username
            }
        }).then(account => {
            if (!account) {
                return res.status(401).send({ message: "Account not found." });
            }

            Responses.findOne({
                where: {
                    email: account.responseEmail
                }
            }).then(response => {
                if (!response) {
                    return res.status(404).send({ message: "Response not found." });
                }

                res.status(200).json({
                    username: decoded.username,
                    isVerified: response.isVerified
                });
            }).catch(err => {
                console.log(err);
                res.status(500).send({ message: err.message });
            });
        }).catch(err => {
            console.log(err);
            res.status(500).send({ message: err.message });
        });
    });
};

exports.fileUploadTwibbon = (req, res) => {
    if (parseInt(req.headers["content-length"]) > 2050000) {
        return res.status(422).send({ message: "Invalid file size" });
    }

    // Gunakan verifyToken sebelum upload.single
    verifyToken(req, res, (err) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }

        // Gunakan upload.single untuk menangani pengunggahan file
        upload.single('file')(req, res, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: "Upload error" });
            }

            res.status(200).send({
                message: "Uploaded successfully!",
                filename: req.file.filename
            });
        });
    });
};
