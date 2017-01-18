var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');
var express = require('express');
var router = express.Router();

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup 注册页
router.get('/', checkNotLogin, function(req, res, next) {
  res.render('signup');
});

// POST /signup 注册(包含上传头像)
router.post('/', checkNotLogin, function(req, res, next) {
  // console.log(req.body);
  var name = req.fields.name;
  var gender = req.fields.gender;
  var bio = req.fields.bio;
  // console.log(req.files.avatar.path);
  //D:\web\nodeProject\myblog\public\img\upload_132781c0f466ffdfd9c0d4c2484b8ce5.jpg
  var avatar = req.files.avatar.path.split(path.sep).pop();//upload_132781c0f466ffdfd9c0d4c2484b8ce5.jpg

  var password = req.fields.password;
  var repassword = req.fields.repassword;

  // 校验参数
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字请限制在 1-10 个字符');
    }
    if (['m', 'f', 'x'].indexOf(gender) === -1) {
      throw new Error('性别只能是 m、f 或 x');
    }
    if (!(bio.length >= 1 && bio.length <= 30)) {
      throw new Error('个人简介请限制在 1-30 个字符');
    }
    // req.files.avatar.name  表示上传的文件的名字
    if (!req.files.avatar.name) {
      throw new Error('缺少头像');
    }
    if (password.length < 6) {
      throw new Error('密码至少 6 个字符');
    }
    if (password !== repassword) {
      throw new Error('两次输入密码不一致');
    }
  } catch (e) {
    // 注册失败，异步删除上传的头像
    fs.unlink(req.files.avatar.path);
    req.flash('error', e.message);
    // console.log(2)
    return res.redirect('/signup');//注册失败的情况下不要再继续执行数据库存储操作，因此用return 来阻止
  }

  password = sha1(password);//用户密码进行加密，加密后的密码存储到数据库中
  
  // 待写入数据库的用户信息
  var user = {
      name:name,
      password:password,
      gender:gender,
      bio:bio,
      avatar:avatar
  }

// 用户信息写入数据库
UserModel.create(user)
          // 这里的result是promise对象的resolve传递出来的
          .then(function (result){
                /*
                console.log(result);

                { result: { ok: 1, n: 1 },
                    ops:
                     [ { name: 'elva444444',
                         password: '063afaa7a19944e3ed0116db9fd840d5c5f4d5ce',
                         gender: 'm',
                         bio: 'sssssssss',
                         avatar: 'upload_6a0406e8e9aaae1d231a64c3cb3e9d5a.jpg',
                         _id: 587e33ce89c51b24fc0170dc } ],
                    insertedCount: 1,
                    insertedIds: [ , 587e33ce89c51b24fc0170dc ] }
                */

                /*
                console.log(result.ops);

                [ { name: 'elva444444',
                    password: '063afaa7a19944e3ed0116db9fd840d5c5f4d5ce',
                    gender: 'm',
                    bio: 'sssssssss',
                    avatar: 'upload_6a0406e8e9aaae1d231a64c3cb3e9d5a.jpg',
                    _id: 587e33ce89c51b24fc0170dc } ]
                */


                /*
                    此user是插入mongodb后的值,包含_id
                    result.ops = docs;
                    docs是一个存储一个对象（存储到数据库中的文档包含id）的数组
                */
                user = result.ops[0];
                // 将用户信息存入session
                delete user.password;
                req.session.user = user;
                // 写入flash
                req.flash('success','注册成功');
                res.redirect('/posts');
          })
          .catch(function (error){
            // 注册失败,异步删除上传的头像
            // 存数据库时出错，删除掉图片上传的路径
            fs.unlink(req.files.avatar.path);
            // 用户名被占用则跳回注册页,而不是错误页面
          /*
              因为设置了用户名的索引则根据用户名来进行query,并且唯一
              不能重复

              E11000 duplicate key：如果存到数据库中的name重复则报此错误
          */
            if(error.message.match('E11000 duplicate key')){
              req.flash('error','用户名已被占用');
              return res.redirect('/signup');
            }
            // 也可能发生其他错误，所以要将错误传递出去
            next(error);//跳转到错误页面
          })
});

module.exports = router;
