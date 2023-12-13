module.exports = (sequelize, Sequelize) => {
    const Admin = sequelize.define("admin", {
        npm: {
            type: Sequelize.STRING,
            unique: true,
            primaryKey: true
        },
        fullname: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        }
    });

    return Admin;
};
