const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('api_group', {
        api_group_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        api_group_name: {
            type: DataTypes.STRING,
        },
        project_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },

    }, {
        freezeTableName: true,
        timestamps: false

    })
}
