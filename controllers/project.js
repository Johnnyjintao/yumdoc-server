const ProjectModel = require('../modules/project')
const db = require('../config/db');
const Sequelize = db.sequelize;
const Project = Sequelize.import('../schema/project');
const uuid = require('node-uuid');

const statusCode = require('../util/status-code')

class articleController {
    /**
     * 创建项目
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        let req = ctx.request.body;
        if(req.project_name && req.version && req.type && req.user_id){
            if(req.project_id){
                await ProjectModel.updateProject(req);
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(0,'更新项目成功！');
            }else{
                req.project_id = uuid.v1().replace(/-/g, "");
                let flag = await ProjectModel.createProject(req);
                if(flag){
                    ctx.response.status = 200;
                    ctx.body = statusCode.SUCCESS_200(0, '新增成功');
                }else{
                    ctx.response.status = 200;
                    ctx.body = statusCode.SUCCESS_200(-1, '新增失败');
                }
            }
             
        }else{
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(-1, '请检查参数');
        }
    }

    // 查询项目列表
    static async querylist(ctx) {
        let req = ctx.request.body;
        if(req.user_id){
            let res = await ProjectModel.getProjectList(req)
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(0, '查询成功',res);

        }else{
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(-1, '请检查参数');
        }
    }

    // 查询项目详情
    static async querydetail(ctx) {
        let req = ctx.request.body;
        if(req.project_id){
            let res = await ProjectModel.getProjectDetail(req)
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(0, '查询成功',res);

        }else{
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(-1, '请检查参数');
        }
    }
    /**
     * 删除项目数据
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async delete(ctx) {
        let req = ctx.request.body;
        let id = req.project_id;

        if (id) {
            try {
                await ProjectModel.deleteProject(id);
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(0,'删除项目成功！');

            } catch (err) {
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(-1, '删除失败',err);
            }
        } else {
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(-1, '请检查参数');

        }
    }


}

module.exports = articleController
