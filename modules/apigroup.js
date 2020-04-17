const db = require('../config/db');
const Sequelize = db.sequelize;
const Apigroup = Sequelize.import('../schema/apigroup');


class ApigroupModel {
    /**
     * 创建分类
     * @param data
     * @returns {Promise<*>}
     */
    static async createApigroup(data) {
        return await Apigroup.create({
            api_group_id: data.api_group_id,
            api_group_name: data.api_group_name,
            project_id: data.project_id,
        })
    }

    /**
     * 查询分类名称是否存在
     * @param data
     * @returns {Promise<*>}
     */
    static async findApigroupByname(data) {
        return await Apigroup.findAll({
            where:{api_group_name:data}
        })
    }



    /**
     * 更新分类数据
     * @param id  分类ID
     * @param data  事项的状态
     * @returns {Promise.<boolean>}
     */
    static async updateApigroup(data) {
        await Apigroup.update({
            api_group_name: data.api_group_name,
            project_id: data.project_id,
        }, {
            where: {
                api_group_id: data.api_group_id,
            },
        });
        return true
    }

    /**
     * 获取分类列表
     * @returns {Promise<*>}
     */
    static async getApigroupList(project_id) {
        return await Apigroup.findAll({
            where:{
                project_id
            }
        })
    }

    // 查询ID分类下的所有文章
    static async getApigroupArticleList(id) {
        return await Apigroup.findAll({
            where: {
                id,
            },
            include: [{
                model: Article
            }]
        })
    }

    /**
     * 获取分类详情数据
     * @param id  文章ID
     * @returns {Promise<Model>}
     */
    static async getApigroupDetail(id) {
        return await Apigroup.findOne({
            where: {
                id,
            },
        })
    }

    /**
     * 删除分类
     * @param id
     * @returns {Promise.<boolean>}
     */
    static async deleteApigroup(api_group_id) {

        return Sequelize.transaction(t => {
            let p1 = Apigroup.destroy({
                where: {api_group_id}
            },{transaction: t});
            let sql = 'UPDATE api SET api_group_id="default" WHERE api_group_id=?';
            let p2 = Sequelize.query(sql,{
                replacements:[api_group_id],
                type: Sequelize.QueryTypes.UPDATE
            },{transaction: t});
            return Promise.all([p1,p2]);

        }).then(result => {
            return true;
            // 事务已被提交
            // result 是 promise 链返回到事务回调的结果
        }).catch(err => {
            console.log('事务被回滚,',err);
            return false;
            // 事务已被回滚
            // err 是拒绝 promise 链返回到事务回调的错误
        });
    }

}

module.exports = ApigroupModel
