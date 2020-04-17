# jtnews-server
#### 正在完善，敬请期待（50%）！
> 你的 "Star" 是我最大的动力！🌹
## 一、项目介绍

- 技术栈：Nodejs, MySQL; Koa2, Sequelize, jwt.
- 用nodejs的koa2框架搭建接口服务器，提供API接口；
- 接口包含：
  - jwt做权限接口验证。
  - 用户登录注册接口；
  - 文章增删改查，搜索，分页接口；
  - 分类增删改查接口；
  - 分类关联多文章。
- Sequelize管理mysql数据库。
- 喜欢或对你学习有帮助的话请点Star，Thanks！




### 项目使用
- 1. 在根目录下进入项目，
- 2. 安装包，执行: `npm install` 命令，
- 3. 启动服务: `npm start`; 监听地址：http://localhost:3000/ 即可以访问。

## 接口配置

```
// 用户注册
router.post('/user/regist', UserController.create);
// 登录
router.post('/user/login', UserController.login);
// 用户删除
router.delete('/user/delete/:id', UserController.delete);
// 用户信息
router.post('/user/info', checkToken,UserController.getUserInfo);
// 用户列表
router.get('/user/list', UserController.getUserList);
// 上传图片
router.post('/article/upload_pic', upload.single('file'), ArticleController.upload_pic)
// 创建文章
router.post('/article/create_article', ArticleController.create)
// 保存文章
router.post('/article/save_article', ArticleController.save)
// 查询文章详情
router.post('/article/query_article', ArticleController.search)

// 创建分类
router.post('/category/create_category', CategoryController.create)
// 获取分类列表
router.post('/category/get_category_list', CategoryController.list)
// 修改分类
router.post('/category/update_category', CategoryController.update)
// 删除分类
router.post('/category/del_category', CategoryController.delete)

```


## 部分接口示例

#### 注册接口

##### 地址：
```
/user/register
```

##### 请求方式

```
POST
```

##### 参数说明

参数 | 说明 | 必填 | 类型
---|---|---|---
username | 用户名 | 是 | String
password | 用户名 | 是 | String

##### 示例（postman软件测试，自己下载测试）

```
http://localhost:3000/api/v1/user/register

参数一：username bobo
参数二：password bobo123
```


##### 创建成功

```js
{
    "code": 200,
    "msg": "创建用户成功",
    "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxpYW5nZmVuZ2JvIiwiaWQiOjMsImlhdCI6MTU0MzM4MjAwOCwiZXhwIjoxNTQzMzg1NjA4fQ.-AEyGpqf5l7uKdaHArEGpKC3L5wHRHSNkvcciVumhBo"
}
```

```


## 最后

项目已实现登录注册接口，文章增删改查，分页，查询以及分类增删改查等接口，自己可以根据项目代码学习；
喜欢或对你有帮助的话请点star或有您有更好的建议和意见，可以提出来告诉我 qq：314573049。

希望能够帮助到你学习！Thanks！
