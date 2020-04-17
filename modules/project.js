const db = require('../config/db');
const Sequelize = db.sequelize;
const Op = Sequelize.Op;
const Project = Sequelize.import('../schema/project');
const ProjectAuthority = Sequelize.import('../schema/projectauthority');
const moment = require('moment');

Project.sync({force: false});

class ProjectModel {
    /**
     * 创建项目
     * @param data
     * @returns {Promise<*>}
     */
    static async createProject(data) {
        return Sequelize.transaction(t => {
            let p1 = Project.create({
                project_id: data.project_id,
                project_name: data.project_name,
                version: data.version,
                type: data.type,
                delete_tag: '0',
                create_time:moment(new Date()).format('YYYY-MM-DD HH:mm'),
                last_update_time:moment(new Date()).format('YYYY-MM-DD HH:mm')
            },{transaction: t});
            let p2 = ProjectAuthority.create({
                project_id: data.project_id,
                user_id: data.user_id,
                permission: 1,
                delete_tag: '0',
                create_time:moment(new Date()).format('YYYY-MM-DD HH:mm')
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

    /**
     * 更新项目数据
     * @param id  用户ID
     * @param data  事项的状态
     * @returns {Promise.<boolean>}
     */
    static async updateProject(data) {
        await Project.update({
            project_name: data.project_name,
            version: data.version,
            type: data.type,
            last_update_time:moment(new Date()).format('YYYY-MM-DD HH:mm')
        }, {
            where: {
                project_id:data.project_id
            },
        });
        return true
    }


    /**
     * 删除项目
     * @param id listID
     * @returns {Promise.<boolean>}
     */
    static async deleteProject(project_id) {
        await Project.update({
            delete_tag: '1',
        }, {
            where: {project_id},
        });
        return true
    }


    static async getProjectList(params){
        let user_id = params.user_id;
        let searchTxt = params.searchTxt;
        let offset = params.offset||0; //从哪一条开始
        let limit = params.limit||10;//查几条
        let sql = "select b.permission,a.user_id,c.project_id,c.project_name,c.type,c.last_update_time,c.version,\n" +
            "(select count(*) from user as a \n" +
            "left join projectauthority as b on (a.user_id=b.user_id) \n" +
            "and (b.delete_tag<>1)\n" +
            "inner join project as c on b.project_id=c.project_id) as count\n" +
            "FROM user as a \n" +
            "left join projectauthority as b on (a.user_id=b.user_id) \n" +
            "and (b.delete_tag<>1)\n" +
            "inner join project as c on b.project_id=c.project_id\n" +
            "where a.user_id=? AND c.delete_tag=0 AND c.project_name like '%"+searchTxt+"%' limit ?,?"
        return Sequelize.query(sql,{
            replacements:[user_id,offset,limit],
            type: Sequelize.QueryTypes.SELECT
        })
    }


    static async getProjectDetail(params){
        let project_id = params.project_id;
        let sql = "select * from project where project_id = ?"
        return Sequelize.query(sql,{
            replacements:[project_id],
            type: Sequelize.QueryTypes.SELECT
        })
    }


}

module.exports = ProjectModel
