const verify = require("../controllers/verify.controller");
const authJwt = require("../middleware/authJwt");
const { body } = require('express-validator');

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/response/all", [authJwt.verifyToken], verify.all);

    app.post("/api/response/verify", [
        authJwt.verifyToken,
        body('name').isLength({ min: 1 }),
        body('emails').trim().isEmail()
    ], verify.verify);

    app.post("/api/response/decline",[
        authJwt.verifyToken,
        body('name').isLength({ min: 1 }),
        body('emails').trim().isEmail()
    ], verify.decline);

    app.post("/api/response/lmsaccount",[
        authJwt.verifyToken,
        body('name').isLength({ min: 1 }),
        body('emails').trim().isEmail()
    ], verify.sendLMSCred);
};