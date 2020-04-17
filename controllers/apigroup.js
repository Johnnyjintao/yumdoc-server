const ApigroupModel = require('../modules/apigroup')
const ApiModel = require('../modules/api')
const statusCode = require('../util/status-code')
const uuid = require('node-uuid');
class ApigroupController {
    /**
     * 新增或删除apigroup
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async cuapigroup(ctx) {
        let req = ctx.request.body;
        if (req.api_group_name,req.project_id) {
            try {

                const finddata = await  ApigroupModel.findApigroupByname(req.api_group_name);

                if(finddata[0] && finddata[0].api_group_name == req.api_group_name){
                    ctx.response.status = 200;
                    ctx.body = statusCode.SUCCESS_200(-1,'名称重复，请重新添加')
                    return;
                }
                if(req.api_group_id){
                    await ApigroupModel.updateApigroup(req);
                }else{
                    req.api_group_id = uuid.v1().replace(/-/g, "");
                    await ApigroupModel.createApigroup(req);
                }
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(0,'操作成功');

            } catch (err) {
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(-1,'操作失败',err)
            }
        } else {
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(-1,'请检查参数')
        }

    }

    /**
     * 获取分类列表
     * @returns {Promise.<void>}
     */
    static async getapilist(ctx) {
        let req = ctx.request.body;
        if(req.project_id){
            try {
                const data = await ApigroupModel.getApigroupList(req.project_id);
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(0,'查询分类列表成功！', data);
            } catch (err) {

                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(-1,'查询分类失败', err);
            }
        }else{
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(-1,'请检查参数');
        }

    }


    /**
     * 删除分类数据
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async delete(ctx) {
        let req = ctx.request.body;
        let id = req.api_group_id;

        if (id) {
            try {
                await ApigroupModel.deleteApigroup(id);
                await ApiModel.updateApigroupid(id);
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(0,'删除分类成功！');

            } catch (err) {
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(-1,'删除分类失败');

            }
        } else {
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(-1,'分类ID必须传！');
        }
    }


}

module.exports = ApigroupController
