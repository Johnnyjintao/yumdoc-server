const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('api', {
        // ID
        api_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        // 项目id
        project_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // 所属分组id
        api_group_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        //标题
        title: {
            type: DataTypes.STRING,
        },
        method: {
            type: DataTypes.STRING,
        },
        path: {
            type: DataTypes.STRING,
        },
        // 文章状态  open 启用 close 弃用
        state: {
            type: DataTypes.STRING,
        },


        //请求头
        reqHeadData: {
            type: DataTypes.TEXT,
        },
        reqparam_value: {
            type: DataTypes.STRING,
        },
        reqparam_RawData: {
            type: DataTypes.TEXT,
        },
        reqparam_FormData: {
            type: DataTypes.TEXT,
        },
        reqparam_JsonData: {
            type: DataTypes.TEXT,
        },
        getrestData: {
            type: DataTypes.TEXT,
        },
        resHeadData: {
            type: DataTypes.TEXT,
        },
        resparam_value: {
            type: DataTypes.STRING,
        },
        resparam_RawData: {
            type: DataTypes.TEXT,
        },
        resparam_JsonData: {
            type: DataTypes.TEXT,
        },
        textarea_suc: {
            type: DataTypes.TEXT,
        },
        textarea_fail: {
            type: DataTypes.TEXT,
        },
        create_user_id: {
            type: DataTypes.STRING,
            allowNull:false
        },
        create_user_name: {
            type: DataTypes.STRING,
            allowNull:false
        },
        update_user_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        update_user_name: {
            type: DataTypes.STRING,
            allowNull:false
        },
        create_time: {
            type: DataTypes.DATE,
            get(){
                return moment(this.getDataValue('create_time')).format('YYYY-MM-DD');
            }
        },
        update_time: {
            type: DataTypes.DATE,
            get(){
                return moment(this.getDataValue('update_time')).format('YYYY-MM-DD');
            }
        },
        sucuri: {
            type: DataTypes.STRING,
        },
        failuri: {
            type: DataTypes.STRING,
        },
    }, {
        freezeTableName: true,
        timestamps: false
    })

}
