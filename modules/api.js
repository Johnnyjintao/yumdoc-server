const db = require('../config/db');
const Sequelize = db.sequelize;
const Api = Sequelize.import('../schema/api');


class ApiModel {
    /**
     * 创建分类
     * @param data
     * @returns {Promise<*>}
     */
    static async createApi(data) {
        return await Api.create(data)
    }


    static async findApiById(api_id) {
        let sql = "select * from api WHERE api_id=?"
        return Sequelize.query(sql,{
            replacements:[api_id],
            type: Sequelize.QueryTypes.SELECT
        })
    }

    /**
     * 更新分类数据
     * @param id  分类ID
     * @param data  事项的状态
     * @returns {Promise.<boolean>}
     */
    static async updateApi(data) {
        await Api.update(data, {
            where: {
                api_id: data.api_id,
            },
        });
        return true
    }

    /**
     * 获取分类列表
     * @returns {Promise<*>}
     */
    static async getApiList(data) {
        let searchTxt = data.searchTxt;
        let offset = data.offset||0; //从哪一条开始
        let limit = data.limit||10;//查几条
        let sql = "select api_id,api_group_id,title,create_user_id,update_user_id,create_user_name,update_user_name,create_time,update_time,path," +
            "(select count(*) from api WHERE project_id=?) as total from " +
            "api WHERE project_id=? and api_group_id=? AND title like '%"+searchTxt+"%' limit ?,?"

        if(data.api_group_id == 'all'){
            sql = "select api_id,api_group_id,title,create_user_id,update_user_id,create_user_name,update_user_name,create_time,update_time,path," +
                "(select count(*) from api WHERE project_id=?) as total from " +
                "api WHERE project_id=?  AND title like '%"+searchTxt+"%' limit ?,?"
            return Sequelize.query(sql,{
                replacements:[data.project_id,data.project_id,offset,limit],
                type: Sequelize.QueryTypes.SELECT
            })
        }
        return Sequelize.query(sql,{
            replacements:[data.project_id,data.project_id,data.api_group_id,offset,limit],
            type: Sequelize.QueryTypes.SELECT
        })
    }


    /**
     * 将此分类下所有的api 的groupid 改成默认值
     * @param id
     * @returns {Promise.<boolean>}
     */
    static async updateApigroupid(api_group_id) {
        let sql = 'UPDATE api SET api_group_id="default" WHERE api_group_id=?';
        return Sequelize.query(sql,{
            replacements:[api_group_id],
            type: Sequelize.QueryTypes.UPDATE
        })
    }

    /**
     * 删除api
     */
    static async deleteApi(api_id) {
        let sql = 'DELETE FROM api WHERE api_id=?'
        return Sequelize.query(sql,{
            replacements:[api_id],
            type: Sequelize.QueryTypes.UPDATE
        })
    }

}

module.exports = ApiModel
