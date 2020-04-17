const userModel = require('../modules/user');
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const bcrypt = require('bcryptjs');
const util = require('util')
const verify = util.promisify(jwt.verify)
const statusCode = require('../util/status-code')
const uuid = require('node-uuid');

class UserController {
    /**
     * 创建账号
     * @param ctx
     * @returns {Promise<void>}
     */
    static async create(ctx) {
        const user = ctx.request.body;
        if (user.user_name && user.account && user.password) {
            // 查询账号是否重复
            const existUser = await userModel.findUserByAccount(user.account);

            if (existUser) {
                // 反馈存在账号
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(-1,'账号已经被注册，请重新填写账号')
            } else {

                // 加密密码
                const salt = bcrypt.genSaltSync();
                const hash = bcrypt.hashSync(user.password, salt);
                user.password = hash;

                user.user_id = uuid.v1().replace(/-/g, "");

                // 创建账号
                await userModel.create(user);
                const newUser = await userModel.findUserByAccount(user.account)

                // 签发token
                const userToken = {
                    account: newUser.account,
                    id: newUser.id
                }

                // 储存token失效有效期1小时
                const token = jwt.sign(userToken, secret.sign, {expiresIn: '1h'});

                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(0,'注册成功', token)
            }
        } else {

            // 参数错误
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(-1,'创建失败，参数错误');
        }
    }

    /**
     * 查询账号信息
     * @param ctx
     * @returns {Promise<void>}
     */
    static async getUserInfo(ctx) {
        // 获取jwt
        const token = ctx.header.authorization;

        if (token) {
            let payload
            try {
                // 解密payload，获取账号名和ID
                payload = await verify(token.split(' ')[1], secret.sign)
                const newUser = await userModel.findUserByAccount(payload.account)

                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(0,'查询成功', newUser)
            } catch (err) {

                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(-1,'查询失败，authorization error!',err)
            }
        }
    }

    /**
     * 删除账号
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async delete(ctx) {
        let id = ctx.params.id;

        if (id && !isNaN(id)) {
            await userModel.delete(id);

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(0,'删除账号成功')
        } else {

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(-1,'账号ID必须传')
        }
    }

    /**
     * 登录
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async login(ctx) {
        const data = ctx.request.body
        // 查询账号
        const user = await userModel.findUserByAccount(data.account)
        // 判断账号是否存在
        if (user) {
            // 判断前端传递的账号密码是否与数据库密码一致
            if (bcrypt.compareSync(data.password, user.password)) {
                // 账号token
                const userToken = {
                    account: user.account,
                    password: user.password
                }
                // 签发token
                const token = jwt.sign(userToken, secret.sign, {expiresIn: '1h'});

                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(0,'登录成功', {
                    user,
                    token: token
                })
            } else {

                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(-1,'账号或密码错误');
            }
        } else {

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(-1,'账号不存在');
        }
    }

    /**
     * 获取账号列表
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getUserList(ctx) {
        let userList = ctx.request.body;

        if (userList) {
            const data = await userModel.findAllUserList();

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(0,'查询成功', data)
        } else {

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(-1,'获取失败')

        }
    }
}

module.exports = UserController