const controller = require("../controllers/auth.controller.js");
const { authJwt } = require("../middleware");
const { body } = require('express-validator');

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/auth/signin", [
        body('npm').isNumeric(),
        body('password').isLength({min: 1}),
    ], controller.signin);

    app.post("/api/auth/refreshtoken", [
        body('version').isLength({min: 1, max: 15})
    ], controller.refreshToken);

    app.post("/api/auth/changePassword", [
        authJwt.verifyToken,
        body('password').isLength({min: 1}),
        body('newPassword').isLength({min: 8}).withMessage('minimal is 8 character')
    ], controller.changePassword);

    app.post("/api/auth/resetPassword", [
        authJwt.verifyToken,
        body('npm').isNumeric()
    ], controller.resetPassword);
};
