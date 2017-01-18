var path = require('path');//path内置模块
var express = require('express');

//


var session = require('express-session');//session(会话)中间件

var MongoStore = require('connect-mongo')(session);
//将session存储到mongodb中的中间件，必须结合express-session中间件使用
var flash = require('connect-flash');//页面通知提示的中间件，基于session实现
//常和redirect一起，req.session.falsh = {}初始化是一个空对象,
// req.flash(key,value)设置值，req.flash(key)获取值，获取值后再删除;


//



var config = require('config-lite');//根据生产环境选择配置文件，并和默认配置文件合并
var routes = require('./routes');//各种路由
var pkg = require('./package');//引入.json文件

var formidable = require('express-formidable');//接收表单及文件的上传的中间件
var app = express();

// 设置存放模板文件的目录目录
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎为 ejs
app.set('view engine', 'ejs');
/*
    app.use()没有设置路径将会匹配所有路径
*/
//设置项目中引用的静态文件加载目录
app.use(express.static(path.join(__dirname,'public')));



// 使用session 中间件
app.use(session({
  name: config.session.name,// 设置 cookie 名称
  secret: config.session.secret,
  // 通过设置的 secret 字符串，来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  cookie: {
    maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  },
  store: new MongoStore({// 将 session 存储到 mongodb
    url: config.mongodb// mongodb 地址
  }),
  resave:true,
  saveUninitialized:true//初始化session时是否保存到存储
}));
// flash 中间件，用来显示通知;基于session
app.use(flash());

//先将上传的图片存储到img文件夹中（并将图片名称进行转码）
app.use(formidable({
  uploadDir:path.join(__dirname,'public/img'),//上传文件目录
  keepExtensions:true//保留后缀
}));

// 常量挂载到app.locals上面
app.locals.blog = {
  title: pkg.name
  // description: pkg.description
};

// // 添加模板必需的三个变量
/*
    这里添加了模板所需要的全局变量，也就是说每个模板都可以使用这个变量，而这个变量是挂在res.locals
    对象上的，通过req,flash来设置;
      首先通过req.flash(key,value);来设置，重定向页面之后，页面的res.locals.[]=req.flash(key)
      就可以获取了
*/
// 变量挂载到res.locals上
app.use(function (req, res, next) {
  // console.log("中间件");
  // 响应依赖于请求，并且res.locals是全局变量,所以只有当req.flash有值得时候,res.locals才有值
  res.locals.user = req.session.user;
  // console.log(req.flash("success"));
  res.locals.success = req.flash('success').toString();//req.flash('success')返回的是一个数组，因此调用数组的toString方法

  res.locals.error = req.flash('error').toString();
  next();//为了让下面的路由中间件继续执行,这个自己定义的中间件必须添加next
});
// 【注:】上面所有中间件没有使用路径，则默认匹配所有路径，因此在匹配下面的路由中间件之前，会先执行以上所有
// 路由
routes(app);

// 监听端口，启动程序
app.listen(config.port, function () {
  console.log(`${pkg.name} listening on port ${config.port}`);//es6模板字符串
})
