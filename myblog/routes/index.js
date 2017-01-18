module.exports = function (app){
  // 根路由
  app.get('/',function (req,res){//默认路由localhost:3000,重定向到localhost:3000/posts
    res.redirect('/posts');
  }),
  // express.Router路由
  app.use('/signup',require('./signup'));//注册
  app.use('/signin',require('./signin'));//登录
  app.use('/signout',require('./signout'));//登出
  app.use('/posts',require('./posts'));//文章
}
