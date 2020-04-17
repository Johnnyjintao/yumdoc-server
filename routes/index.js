const Router = require('koa-router')
const UserController = require('../controllers/user')
const ProjectController = require('../controllers/project')
const ApigroupController = require('../controllers/apigroup')
const ApiController = require('../controllers/api')
const ProAuthController = require('../controllers/projectauthority')
// const CategoryController = require('../controllers/category')

const router = new Router({
    prefix: '/api'
})

const checkToken = require('../token/checkToken.js');

const multer = require('koa-multer');//加载koa-multer模块
//配置
var storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, 'uploads/images/')
    },
    //修改文件名称
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
//加载配置
var upload = multer({ storage: storage });


router.post('/user/regist', UserController.create);
router.post('/user/login', UserController.login);
router.delete('/user/delete/:id', UserController.delete);
router.post('/user/getuserinfo', checkToken,UserController.getUserInfo);
router.get('/user/list', UserController.getUserList);

router.post('/project/createupdate', checkToken,ProjectController.create);
router.post('/project/getprojectlist', checkToken, ProjectController.querylist);
router.post('/project/getprojectdetail', checkToken, ProjectController.querydetail);
router.post('/project/delete', checkToken,ProjectController.delete);

router.post('/apigroup/deleteapigroup', checkToken,ApigroupController.delete);
router.post('/apigroup/cuapigroup', checkToken,ApigroupController.cuapigroup);
router.post('/apigroup/getapigrouplist', checkToken,ApigroupController.getapilist);

router.post('/api/createapi', checkToken,ApiController.createapi);
router.post('/api/updateapi', checkToken,ApiController.updateapi);
router.post('/api/getapilist', checkToken,ApiController.getapilist);
router.post('/api/getapidetail', checkToken,ApiController.getapidetail);
router.post('/api/deleteapi', checkToken,ApiController.deleteapi);

router.post('/proauth/joinproject', checkToken,ProAuthController.joinproject);
router.post('/proauth/findpersoninpro', checkToken,ProAuthController.findpersoninpro);
router.post('/proauth/updatePermission', checkToken,ProAuthController.updatePermission);
router.post('/proauth/getPermissionById', checkToken,ProAuthController.getPermissionById);
router.post('/proauth/joinproject2', checkToken,ProAuthController.joinproject2);
router.post('/proauth/deleteproauth', checkToken,ProAuthController.deleteproauth);


router.get('/mockapi/:api_id/*', ApiController.findapibyid);
router.post('/mockapi/:api_id/*', ApiController.findapibyid);
router.put('/mockapi/:api_id/*', ApiController.findapibyid);
router.delete('/mockapi/:api_id/*', ApiController.findapibyid);
router.head('/mockapi/:api_id/*', ApiController.findapibyid);
router.options('/mockapi/:api_id/*', ApiController.findapibyid);
router.patch('/mockapi/:api_id/*', ApiController.findapibyid);



module.exports = router
