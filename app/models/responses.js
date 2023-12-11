module.exports = (sequelize, Sequelize) => {
    const Response = sequelize.define("responses", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
            primaryKey: true
        },
        phone: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        package: {
            type: Sequelize.ENUM('luring', 'daring', 'luxury'),
            allowNull: false
        },
        batch: {
            type: Sequelize.ENUM('early bird', 'reguler', 'last chance'),
            allowNull: false
        },
        isVerified: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            default: false,
        }
    });

    return Response;
};
