const db = require('../config/db');
const Sequelize = db.sequelize;
const Op = Sequelize.Op;
const ProjectAuthority = Sequelize.import('../schema/projectauthority');
const moment = require('moment');

ProjectAuthority.sync({force: false});

class ProjectAuthorityModel {
    /**
     * 加入项目
     */
    static async joinProjectAuthority(data,permission) {
        return  ProjectAuthority.create({
            project_id: data.project_id,
            user_id: data.user_id,
            permission: permission,
            delete_tag:0,
            create_time:moment(new Date()).format('YYYY-MM-DD HH:mm')
        })
    }

    /**
     * 查询某人是否存在于某项目中
     * */
    static findUserInProjectAuthority(data) {
        let sql = 'select * from projectauthority where project_id=? and user_id=? and permission<>5';
        return Sequelize.query(sql,{
            replacements:[data.project_id,data.user_id],
                type: Sequelize.QueryTypes.SELECT
        })
    }

    /**
     * 查询某项目是否存在
     * */
    static findProjectById(data) {
        let sql = 'select * from project where project_id=?';
        return Sequelize.query(sql,{
            replacements:[data.project_id],
            type: Sequelize.QueryTypes.SELECT
        })
    }


    /*查询项目下的所有人员*/
    static findPersonInpro(data) {
        let sql = 'SELECT a.user_id,a.user_name,b.permission\n' +
            'FROM USER AS a LEFT JOIN projectauthority AS b ON a.user_id = b.user_id\n' +
            'WHERE b.project_id = ? AND (b.delete_tag <> 1)';
        return Sequelize.query(sql,{
            replacements:[data.project_id],
            type: Sequelize.QueryTypes.SELECT
        })
    }

    /* 给人员修改权限 */
    static updatePermission(data) {
        if(data.permission == 1){ //更换管理员 先将本人改为读写，再将要设置的人改为管理员
            let sql1 = 'UPDATE projectauthority SET permission="2" WHERE project_id=? and user_id=?';
            let sql2 = 'UPDATE projectauthority SET permission="1" WHERE project_id=? and user_id=?';
            return Sequelize.transaction(t => {
                let p1 = Sequelize.query(sql1,{
                    replacements:[data.project_id,data.user_id],
                    type: Sequelize.QueryTypes.UPDATE
                },{transaction: t})
                let p2 = Sequelize.query(sql2,{
                    replacements:[data.project_id,data.set_user_id],
                    type: Sequelize.QueryTypes.UPDATE
                },{transaction: t});
                return Promise.all([p1,p2]);

            }).then(result => {
                console.log('事务被提交,',result);
                return true;
            }).catch(err => {
                console.log('事务被回滚,',err);
                return false;
            });
        }else{
            let sql = 'UPDATE projectauthority SET permission=? WHERE project_id=? and user_id=?';
            return Sequelize.query(sql,{
                replacements:[data.permission,data.project_id,data.set_user_id],
                type: Sequelize.QueryTypes.UPDATE
            })
        }
    }

    /*查询某人在项目中的权限*/
    static getPermissionById(data) {
        let sql = 'SELECT permission from projectauthority where user_id=? and project_id=?';
        return Sequelize.query(sql,{
            replacements:[data.user_id,data.project_id],
            type: Sequelize.QueryTypes.SELECT
        })
    }

    /*查询某人在项目中的权限*/
    static deleteproauth(data) {
        let sql = 'DELETE from projectauthority where user_id=? and project_id=?';
        return Sequelize.query(sql,{
            replacements:[data.user_id,data.project_id],
            type: Sequelize.QueryTypes.DELETE
        })
    }

}

module.exports = ProjectAuthorityModel
