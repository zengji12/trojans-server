const config = require("../configs/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
    dialectOptions: config.dialectOptions,
    timezone: config.timezone,
    logging: false,
    define: {
        collate: config.collate,
        charset: config.charset,
    }
}
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.responses = require("./responses.js")(sequelize, Sequelize);
db.deletedResponses = require("./deleted_responses.js")(sequelize, Sequelize);
db.accounts = require("./accounts.js")(sequelize, Sequelize);

db.responses.hasOne(db.accounts);
db.accounts.belongsTo(db.responses);

module.exports = db;