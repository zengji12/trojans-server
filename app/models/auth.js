module.exports = (sequelize, Sequelize) => {
    const Admin = sequelize.define("admins", {
        npm: {
            type: Sequelize.STRING,
            unique: true,
            primaryKey: true
        },
        fullname: {
            type: Sequelize.STRING,
            allowNull: false
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    return Admin;
};
