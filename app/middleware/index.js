const authJwt = require("./authJwt");
const { upload, verifyToken } = require('./uploadJwt'); 

module.exports = {
    authJwt,
    upload,
    verifyToken,
};
