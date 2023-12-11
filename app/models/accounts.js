module.exports = (sequelize, Sequelize) => {
    const Account = sequelize.define("accounts", {
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {timestamps: false});

    return Account;
};
