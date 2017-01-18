// 登录页面只要在未登录的情况下访问，checkNotLogin为了阻止已经登录的用户访问注册页面，此时会返回到之前的页面
var express = require('express');
var router = express.Router();
var checkNotLogin =require('../middlewares/check').checkNotLogin;
var UserModel = require('../models/users');
var sha1 = require('sha1');
// GET /signin 登录页
router.get('/',checkNotLogin,function (req,res,next){
  res.render('signin');
})

// POST /signin 用户登录
router.post('/',checkNotLogin,function (req,res,next){
  var name = req.fields.name;
  var password  = req.fields.password;


  // 利用Model操作数据库，进行查找操作
  UserModel.getUserByName(name)
            .then(function (user){

              // 如果从数据库中查不到此用户
              if(!user){
                  req.flash('error','用户不存在');
                  return res.redirect('back');
              }

              // 在查询到用户情况下，检查输入的密码是否和数据库中匹配
              if(sha1(password)!==user.password){
                req.flash('error','用户名或密码错误');
                return res.redirect('back');
              }

              req.flash('success','登陆成功');

              // 用户信息写入session
              delete user.password;
              req.session.user = user;

              // 跳转到主页
              res.redirect('/posts');
            })
            .catch(function (error){
              next(error);
            })
})

module.exports = router;
