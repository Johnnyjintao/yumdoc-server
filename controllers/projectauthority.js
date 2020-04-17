const ProjectAuthorityModel = require('../modules/projectauthority')
const db = require('../config/db');
const Sequelize = db.sequelize;
const Project = Sequelize.import('../schema/project');
const uuid = require('node-uuid');

const statusCode = require('../util/status-code')

class ProAuthController {

    // 加入项目列表
    static async joinproject(ctx) {
        let req = ctx.request.body;
        if(req.user_id && req.project_id){
            let res1 = await ProjectAuthorityModel.findUserInProjectAuthority(req)
            if(res1.length>0){
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(-1, '您已在该项目中');
                return;
            }
            let res2 = await ProjectAuthorityModel.findProjectById(req)
            if(res2.length == 0){
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(-1, '项目不存在');
                return;
            }

            await ProjectAuthorityModel.joinProjectAuthority(req,4);
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(0, '加入成功');

        }else{
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(-1, '请检查参数');
        }
    }

    // 查询项目中的人员
    static async findpersoninpro(ctx) {
        let req = ctx.request.body;
        if(req.project_id){
            let res = await ProjectAuthorityModel.findPersonInpro(req)
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(0, '查询成功',res);

        }else{
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(-1, '请检查参数');
        }
    }

    // 给人员修改权限
    static async updatePermission(ctx) {
        let req = ctx.request.body;
        if(req.project_id && req.permission && req.user_id && req.set_user_id){

            await ProjectAuthorityModel.updatePermission(req)
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(0, '修改成功');

        }else{
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(-1, '请检查参数');
        }
    }

    // 查询某人在项目中的权限
    static async getPermissionById(ctx) {
        let req = ctx.request.body;
        if(req.project_id && req.user_id){

            let result = await ProjectAuthorityModel.getPermissionById(req)
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(0, '查询成功',result[0]);

        }else{
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(-1, '请检查参数');
        }
    }

    //管理员邀请人加入项目中，并给他分配权限
    static async joinproject2(ctx) {
        let req = ctx.request.body;
        if(req.user_id && req.project_id && req.permission){
            let res1 = await ProjectAuthorityModel.findUserInProjectAuthority(req)
            if(res1.length>0){
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(-1, '该人员已在该项目中');
                return;
            }

            await ProjectAuthorityModel.joinProjectAuthority(req,req.permission);
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(0, '加入成功');

        }else{
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(-1, '请检查参数');
        }
    }

    //删除数据
    static async deleteproauth(ctx) {
        let req = ctx.request.body;
        if(req.user_id && req.project_id){
            await ProjectAuthorityModel.deleteproauth(req,req.permission);
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(0, '加入成功');

        }else{
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(-1, '请检查参数');
        }
    }
}

module.exports = ProAuthController
