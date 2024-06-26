const controller = require("../controllers/form.controller");
const { body } = require('express-validator')
const multer = require('multer')
const { authJwt } = require("../middleware");
var upload = multer({ dest: `${__dirname}/../exports/` })

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/files", upload.single("file"), controller.fileUpload);

    app.post("/api/register", [
        body('name').isLength({ min: 1 }),
        body('email').trim().isEmail(),
        body('phone').whitelist('+1234567890'),
        body('package').isIn(['luring', 'daring', 'luxury']),
        body('batch').isIn(['early bird', 'reguler', 'last chance']),
        body('followProofId').isLength({ min: 1 }),
        body('transferProofId').isLength({ min: 1 }),
        body('commentProofId').isLength({ min: 1 }),
        body('posterProofId').isLength({ min: 1 }),
    ], controller.register);
};
