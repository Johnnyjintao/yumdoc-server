const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
        user_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
            primaryKey: true,
        },
        user_name: {type: DataTypes.STRING(50)},
        account: {type: DataTypes.STRING(50)},
        password: {
            type: DataTypes.STRING(255),
        },
        login_time: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD');
            }
        },
       sex:{
           type: DataTypes.STRING(10),
       },
        head_img:{
            type: DataTypes.STRING(300),
        },
        mobile:{
            type: DataTypes.STRING(50),
        }
    }, {
        // 如果为 true 则表的名称和 model 相同，即 user
        // 为 false MySQL创建的表名称会是复数 users
        // 如果指定的表名称本就是复数形式则不变
        freezeTableName: true,
        timestamps: false
    })
}
