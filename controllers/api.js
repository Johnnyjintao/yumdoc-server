const ApiModel = require('../modules/api')
const statusCode = require('../util/status-code')
const uuid = require('node-uuid');
const URL = require('url');
const Mock = require("mockjs");
const os = require('os');
///////////////////获取本机ip///////////////////////
function getIPAdress() {
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}
const myHost = getIPAdress();

class ApiController {
    /**
     * 新增api
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async createapi(ctx) {
        let req = ctx.request.body;
        if (req.project_id && req.api_group_id && req.title && req.path && req.user_id) {
            try {
                req.api_id = uuid.v1().replace(/-/g, "");

                // if(req.textarea_suc){
                    req.sucuri = myHost+':5000/api/mockapi/'+req.api_id+'/?sucuri='+req.path;
                    console.log('req.sucuri',req.sucuri)
                // }
                // if(req.textarea_fail){
                //     req.failuri = myHost+':5000/api/mockapi/' +req.api_id+ '?failuri='+req.path;
                //     console.log('req.failuri',req.failuri)
                // }

                req.update_user_name = req.user_name;
                req.update_user_id = req.user_id;
                req.update_time = new Date();
                req.create_user_name = req.user_name;
                req.create_user_id = req.user_id;
                req.create_time = new Date();
                await ApiModel.createApi(req);
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
     * 修改api
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async updateapi(ctx) {
        let req = ctx.request.body;
        if (req.project_id && req.api_group_id && req.title && req.path && req.user_id && req.api_id) {
            try {
                // if(req.textarea_suc){
                    req.sucuri = myHost+':5000/api/mockapi/'+req.api_id+'/?sucuri='+req.path;
                    console.log('req.sucuri',req.sucuri)
                // }
                // if(req.textarea_fail){
                //     req.failuri = myHost+':5000/api/mockapi/' +req.api_id+ '?failuri='+req.path;
                //     console.log('req.failuri',req.failuri)
                // }

                req.update_user_name = req.user_name;
                req.update_user_id = req.user_id;
                req.update_time = new Date();
                await ApiModel.updateApi(req);
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
     * 查看api详情
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getapidetail(ctx) {
        let req = ctx.request.body;
        if (req.api_id) {
            let result = await ApiModel.findApiById(req.api_id);
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(0,'操作成功',result[0]);
        } else {
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(-1,'请检查参数')
        }
    }
    static formatJSON(data){
        let theobj;
        const initObj = function(data,obj={}){
            for(let i=0;i<data.length;i++){
                let item = data[i];
                item["exam|"+item.mock] = item.exam;
                item = Mock.mock(item);
                if(!item.name){ //这是 数组类型的子集
                    if(item.type == 'object'){
                        obj.push({});
                    }else if(item.type == 'array'){
                        obj.push([]);
                    }else{
                        obj.push(item.exam);
                    }
                }else if(item.type == 'array'){
                    obj[item.name] = [];
                }else if(item.type == 'object'){
                    obj[item.name] = {};
                }else{
                    obj[item.name] = item.exam;
                }

                if(item.child.length>0){
                    if(item.name){
                        initObj(item.child,obj[item.name]);
                    }else{
                        initObj(item.child,obj[i]);
                    }
                }


            }
            theobj = obj;
        }

        initObj(data,{})
        return JSON.stringify(theobj);

    }
    static async findapibyid(ctx) {

        let getQueryString = function (url) {
            let arg = URL.parse(url, true).query;
            return arg;
        };
        let api_id = ctx.params.api_id;
        if (api_id) {
            let result = await ApiModel.findApiById(api_id);

            let resparam_JsonData = JSON.parse(result[0].resparam_JsonData);
            let resparam_RawData = JSON.parse(result[0].resparam_RawData);

            if(getQueryString(ctx.originalUrl).sucuri == result[0].path){
                if(result[0].resparam_value == "JSON"){
                    let backdata = ApiController.formatJSON(resparam_JsonData);
                    ctx.response.status = 200;
                    ctx.body = backdata;
                }else{
                    ctx.response.status = 200;
                    ctx.body = resparam_RawData;
                }
                return;
            }
            ctx.body = "请确保url填写正确";

            // // 查询apiid 并且 后续uri==path 的记录，并返回该记录的成功回调
            // if(getQueryString(ctx.originalUrl).sucuri && getQueryString(ctx.originalUrl).sucuri == result[0].path){
            //     ctx.response.status = 200;
            //     if(result.length>0){
            //         ctx.body = JSON.parse(result[0].textarea_suc);
            //     }else{
            //         ctx.body = "未查询到数据";
            //     }
            //     return;
            // }
            // // 查询apiid 并且 后续uri==path 的记录，并返回该记录的成功回调
            // if(getQueryString(ctx.originalUrl).failuri && getQueryString(ctx.originalUrl).failuri == result[0].path){
            //     ctx.response.status = 200;
            //     if(result.length>0){
            //         ctx.body = result[0].textarea_fail;
            //     }else{
            //         ctx.body = "未查询到数据";
            //     }
            //     return;
            // }

        } else {
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(-1,'请检查参数')
        }

    }

    /**
     * 获取接口列表
     * @returns {Promise.<void>}
     */
    static async getapilist(ctx) {
        let req = ctx.request.body;
        if(req.project_id){
            try {
                const data = await ApiModel.getApiList(req);
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(0,'查询列表成功！', data);
            } catch (err) {

                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(-1,'查询列表失败', err);
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
    static async deleteapi(ctx) {
        let req = ctx.request.body;
        let id = req.api_id;
        if (id) {
            try {
                await ApiModel.deleteApi(id);
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(0,'删除成功！');
            } catch (err) {
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(-1,'删除失败');
            }
        } else {
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(-1,'api_id必须传！');
        }
    }


}

module.exports = ApiController
