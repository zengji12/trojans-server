const db = require("../models");
const Response = db.responses;

const fs = require('fs-extra');
const zip = require('express-zip');
const csvwriter = require("csv-writer");
const createCsvWriter = csvwriter.createObjectCsvWriter;

exports.download = (req, res) => {
    Response.findAll({}).then(responses => {
        let files = []
        let fileDir = fs.readdirSync(`${__dirname}/../exports`);
        fileDir.forEach(file => {
            files.push({
                path: `${__dirname}/../exports/${file}`,
                name: file
            })
        });
        let toWrite = []
        responses.forEach((response) => {
            toWrite.push({
                name: response.name,
                email: response.email,
                phone: response.phone,
                package: response.package,
                batch: response.batch,
                createdAt: response.createdAt,
                isVerified: response.isVerified,
                comment: 'https://korpstar-poltekssn.org:8444/MqKWCubcX971qfC5jISs7o5Vxhm7xTmkf84jfzeVvnZe1FgIAqPkEO0s3v2fZ5AFcXDbL4I96Fha4zoqPkyMlTF3pUts5aCmqGRD/' + response.email + '_comment.png',
                follow: 'https://korpstar-poltekssn.org:8444/MqKWCubcX971qfC5jISs7o5Vxhm7xTmkf84jfzeVvnZe1FgIAqPkEO0s3v2fZ5AFcXDbL4I96Fha4zoqPkyMlTF3pUts5aCmqGRD/' + response.email + '_follow.png',
                transfer: 'https://korpstar-poltekssn.org:8444/MqKWCubcX971qfC5jISs7o5Vxhm7xTmkf84jfzeVvnZe1FgIAqPkEO0s3v2fZ5AFcXDbL4I96Fha4zoqPkyMlTF3pUts5aCmqGRD/' + response.email + '_transfer.png',
            })
        })
        let csvFile = `${__dirname}/../exports/responses.tmp`
        const csvWriter = createCsvWriter({
            path: csvFile,
            header: [
                { id: "name", title: "name" },
                { id: "email", title: "email" },
                { id: "phone", title: "phone" },
                { id: "package", title: "package" },
                { id: "batch", title: "batch" },
                { id: "createdAt", title: "createdAt" },
                { id: "isVerified", title: "isVerified" },
                { id: "comment", title: "comment" },
                { id: "follow", title: "follow" },
                { id: "transfer", title: "transfer" },
            ]
        });
        csvWriter.writeRecords(toWrite).then(() => {
            files.push({
                path: csvFile,
                name: `responses.csv`
            })
            res.zip(files);
        });
    }).catch(err => {
        console.log(err);
        res.status(500).send({ message: err.message });
    });
};

exports.CSVDownload = (req, res) => {
    Response.findAll({}).then(responses => {
        let csvFile = `${__dirname}/../exports/responses.tmp`
        const csvWriter = createCsvWriter({
            path: csvFile,
            header: [
                { id: "name", title: "name" },
                { id: "email", title: "email" },
                { id: "phone", title: "phone" },
                { id: "package", title: "package" },
                { id: "batch", title: "batch" },
                { id: "createdAt", title: "createdAt" },
                { id: "isVerified", title: "isVerified" },
                { id: "comment", title: "comment" },
                { id: "follow", title: "follow" },
                { id: "transfer", title: "transfer" },
            ]
        });
        let toWrite = []
        responses.forEach((response) => {
            toWrite.push({
                name: response.name,
                email: response.email,
                phone: response.phone,
                package: response.package,
                batch: response.batch,
                createdAt: response.createdAt,
                isVerified: response.isVerified,
                comment: 'https://korpstar-poltekssn.org:8444/MqKWCubcX971qfC5jISs7o5Vxhm7xTmkf84jfzeVvnZe1FgIAqPkEO0s3v2fZ5AFcXDbL4I96Fha4zoqPkyMlTF3pUts5aCmqGRD/' + response.email + '_comment.png',
                follow: 'https://korpstar-poltekssn.org:8444/MqKWCubcX971qfC5jISs7o5Vxhm7xTmkf84jfzeVvnZe1FgIAqPkEO0s3v2fZ5AFcXDbL4I96Fha4zoqPkyMlTF3pUts5aCmqGRD/' + response.email + '_follow.png',
                transfer: 'https://korpstar-poltekssn.org:8444/MqKWCubcX971qfC5jISs7o5Vxhm7xTmkf84jfzeVvnZe1FgIAqPkEO0s3v2fZ5AFcXDbL4I96Fha4zoqPkyMlTF3pUts5aCmqGRD/' + response.email + '_transfer.png',
            })
        })
        csvWriter.writeRecords(toWrite).then(() => {
            res.zip([{
                path: csvFile,
                name: `responses.csv`
            }]);
        });
    }).catch(err => {
        console.log(err);
        res.status(500).send({ message: err.message });
    });
};
