module.exports = (sequelize, Sequelize) => {
    const DeletedResponse = sequelize.define("deleted_responses", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false
        },
        package: {
            type: Sequelize.ENUM('luring', 'daring', 'luxury'),
            allowNull: false
        },
        batch: {
            type: Sequelize.ENUM('early bird', 'reguler', 'last chance'),
            allowNull: false
        }
    });

    return DeletedResponse;
};
