const db = require("../models");
const Response = db.responses;

const fs = require('fs-extra');
const { validationResult } = require('express-validator');
const { Op } = require("sequelize");
const mailer = require("../configs/mail.config")

exports.fileUpload = (req, res) => {
    if (parseInt(req.headers["content-length"]) > 2050000) {
        return res.status(422).send({ message: "Invalid file size" })
    }
    let ext = '';
    if (req.file.mimetype == 'image/png') {
        ext = 'png'
    } else if (req.file.mimetype == 'image/jpg' || req.file.mimetype == 'image/jpeg') {
        ext = 'jpg'
    } else {
        return res.status(422).send({ message: "Invalid file type" })
    }
    const date = Date.now()
    const newfilename = `${ext}_${date}.tmp`
    var src = fs.createReadStream(req.file.path);
    var dest = fs.createWriteStream(`${__dirname}/../exports/${newfilename}`);
    src.pipe(dest);
    src.on('end', function () {
        fs.unlinkSync(req.file.path);
        res.status(200).send({
            message: "Uploaded successfully!",
            fileId: newfilename
        });
    });
    src.on('error', function (err) {
        fs.unlinkSync(req.file.path);
        console.log(err);
        res.status(500).send({ message: err });
    });
};

exports.register = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(`[registration fail][${new Date()}]`, req.body, errors.array());
        return res.status(422).send({ message: "Invalid input", errors: errors.array() })
    }
    Response.findOne({
        where: {
            [Op.or]: {
                email: req.body.email,
                phone: req.body.phone,
            }
        }
    }).then(x => {
        if (x) {
            return res.status(422).send({ message: "Email or phone number already registered" })
        }
        try {
            fs.renameSync(`${__dirname}/../exports/${req.body.transferProofId}`, `${__dirname}/../exports/${req.body.email}_transfer.${req.body.transferProofId.substring(0, 3)}`)
            fs.renameSync(`${__dirname}/../exports/${req.body.followProofId}`, `${__dirname}/../exports/${req.body.email}_follow.${req.body.followProofId.substring(0, 3)}`)
            fs.renameSync(`${__dirname}/../exports/${req.body.commentProofId}`, `${__dirname}/../exports/${req.body.email}_comment.${req.body.commentProofId.substring(0, 3)}`)
        } catch (error) {
            console.log(error);            
        }
        Response.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            package: req.body.package,
            batch: req.body.batch,
            isVerified: false,
        }).then(user => {
            mailer.sendMail({
                from: "no-reply@trojans.site",
                to: req.body.email,
                subject: "TROJANS 2024 Registration",
                text: `
Hi ${req.body.name},
Thank You for filling out the participation registration form from Trojans 2024.
                
We will process your registration form. We really hope you wait patiently because we will check your form and we will send you an email respons on 24x2.
                
If up to 24x2 you haven't received a email respons, please contact us via our social media.
                
                
We wish to see you at the finish line, Keep doing your best.
                
✉️ Email : humastrojans23@gmail.com
📞 Telegram : @trojans_id
📞 Whatsapp : 089618710082
                
Best Regards,
Trojans 2024
`
            }).then(info => {
                console.log(`[${new Date()}] email sent to ${req.body.email}`);
                // console.log(info);
            }).catch(err => {
                console.log(err);
            });
            console.log(`[registration][${new Date()}] ${req.body.name} - ${req.body.email}`);
            res.status(200).send({ message: "Registered successfully!" });
        }).catch(err => {
            console.log(err);
            res.status(422).send({ message: err.message });
        });
    }).catch(err => {
        console.log(err);
        res.status(500).send({ message: "Server error!" });
    });
};

exports.manualRegister = (body) => {
    Response.findOne({
        where: {
            [Op.or]: {
                email: body.email,
                phone: body.phone,
            }
        }
    }).then(x => {
        if (x) {
            console.log("Email or phone number already registered")
            return false;
        }
        try {
            fs.renameSync(`${__dirname}/../exports/${body.transferProofId}`, `${__dirname}/../exports/${body.email}_transfer.${body.transferProofId.substring(0, 3)}`)
            fs.renameSync(`${__dirname}/../exports/${body.followProofId}`, `${__dirname}/../exports/${body.email}_follow.${body.followProofId.substring(0, 3)}`)
            fs.renameSync(`${__dirname}/../exports/${body.commentProofId}`, `${__dirname}/../exports/${body.email}_comment.${body.commentProofId.substring(0, 3)}`)
        } catch (error) {
            console.log(error);            
        }
        Response.create({
            name: body.name,
            email: body.email,
            phone: body.phone,
            package: body.package,
            batch: body.batch,
            isVerified: false,
        }).then(user => {
            mailer.sendMail({
                from: "no-reply@trojans.site",
                to: body.email,
                subject: "TROJANS 2024 Registration",
                text: `
Hi ${body.name},
Thank You for filling out the participation registration form from Trojans 2024.
                
We will process your registration form. We really hope you wait patiently because we will check your form and we will send you an email respons on 24x2.
                
If up to 24x2 you haven't received a email respons, please contact us via our social media.
                
                
We wish to see you at the finish line, Keep doing your best.
                
✉️ Email : humastrojans23@gmail.com
📞 Telegram : @trojans_id
📞 Whatsapp : 089618710082
                
Best Regards,
Trojans 2024
    `
            }).then(info => {
                console.log(`[${new Date()}] email sent to ${body.email}`);
                // console.log(info);
            }).catch(err => {
                console.log(err);
            });
            console.log(`[registration][${new Date()}] ${body.name} - ${body.email}`);
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    });
}