const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('projectauthority', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement:true,
        },
        project_id: {
            type: DataTypes.STRING,
        },
        user_id: {
            type: DataTypes.STRING,
        },

        permission: {
            type: DataTypes.STRING,
        },
        delete_tag: {
            type: DataTypes.STRING,
        },
        create_time: {
            type: DataTypes.DATE,
            get(){
                return moment(this.getDataValue('join_time')).format('YYYY-MM-DD');
            }

        },
    }, {
        // 如果为 true 则表的名称和 model 相同，即 user
        // 为 false MySQL创建的表名称会是复数 users
        // 如果指定的表名称本就是复数形式则不变
        freezeTableName: true,
        timestamps: false
    })
}
