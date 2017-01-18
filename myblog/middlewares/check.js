/*权限控制：
  不管是论坛还是博客网站，我们没有登录的话只能浏览，登陆后才能发帖或写文章，即使登录了
  你也不能修改或删除其他人的文章，这就是权限控制。我们也来给博客添加权限控制，如何实现
  页面的权限控制呢？我们可以把用户状态的检查封装成一个中间件，在每个需要权限控制的路由
  加载该中间件，即可实现页面的权限控制
*/
module.exports = {
  //如果未登录则提示未登录
  checkLogin:function(req,res,next){
  /*
我们通过引入 express-session 中间件实现对会话的支持：
  app.use(session(options))
session 中间件会在 req 上添加 session 对象，即 req.session 初始值为 {}，当我们登录后
设置 req.session.user = 用户信息，返回浏览器的头信息中会带上 set-cookie 将 session id
写到浏览器 cookie 中，那么该用户下次请求时，通过带上来的 cookie 中的 session id 我们就
可以查找到该用户，并将用户信息保存到 req.session.user。
    */
    if(!req.session.user){
      /*
      express-session: 会话（session）支持中间件
connect-mongo: 将 session 存储于 mongodb，需结合 express-session
使用，我们也可以将 session 存储于 redis，如 connect-redis
connect-flash: 基于 session 实现的用于通知功能的中间件，需结合 express-session 使用
      */

    /*
      connect-flash 是基于 session 实现的，它的原理很简单：设置初始值 req.session.flash={}，
      通过 req.flash(name, value) 设置这个对象下的字段和值，通过 req.flash(name) 获取这个对
      象下的值，同时删除这个字段。
    */
      req.flash('error',"未登录");//flash的message存储在session中

      return res.redirect('/signin');//这里的return 是为了终止next
    }
    next();
  },
  checkNotLogin:function(req,res,next){//用来阻止在已经登录的情况下还可以访问signin和signup
    if(req.session.user){
      /*
          闪存通常与重定向结合使用，确保消息可用于要呈现在下一页
      */
      req.flash('error','已登录');
      return res.redirect('back');
      //返回之前登录的页面(比如从一个文章页面打开/signin页面，发现用户以及登录了，则调回文章页面)
    }
    /*
    checkLogin: 当用户信息（req.session.user）不存在，即认为用户没有登录，则跳转到登录页，
    同时显示 未登录 的通知，用于需要用户登录才能操作的页面及接口
    checkNotLogin: 当用户信息（req.session.user）存在，即认为用户已经登录，
    则跳转到之前的页面，同时显示 已登录 的通知，如登录、注册页面及登录、注册的接口
    */
    next();
  }
}
