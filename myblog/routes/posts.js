/*
    文章相关路由：
      1、所有用户或者特定用户的文章页面(所有文章在同一个页面，通常是一个标题带一部分文章内容)，
          显示文章的页面不需要控制权限
      2、其中某一篇的文章页(不需要权限控制)
      3、创建一条留言接口(在单独文章页面内)
      4、删除一条留言接口(在单独文章页面内)
      5、发表一篇文章的接口(在所有文章的页面内)
      6、发表文章页面(5->6)
      7、跟新一篇文章接口(在单独文章页面内)
      8、更新文章页(7->8)
      9、删除文章接口(在单独文章页面内)

*/
var express = require('express');
var router = express.Router();
var checkLogin = require('../middlewares/check').checkLogin;
var PostModel = require('../models/posts');

// GET /posts  1、所有用户或者特定用户的文章页面(显示文章无需控制权限)
// eg:GET /posts?author=xxx
router.get('/',function(req,res,next){
    // res.send(req.flash());
    // console.log("connect-mongo中间件将session存储到Mongodb以后再渲染posts");
    res.render('posts');
})

// GET /posts/create 6、发表文章页面(需要登录才能发表)
router.get('/create',checkLogin,function (req,res,next){
  res.render('create');
});
//  GET /posts/:postId 2、单独一篇文章页面(无需控制权限)
router.get('/:postId',function (req,res,next){
  res.send(req.flash());
});
// POST /posts/:postId/comment 3、创建一条留言
router.post('/:postId/comment',checkLogin,function (req,res,next){
  res.send(req.flash());
});
// POST /posts/:postId/comment/:commentId/remove 4、删除一条留言
router.post('/:postId/comment/:commentId/remove',checkLogin,function (req,res,next){
  res.send(req.flash());
})
// POST /posts 5、发表一篇文章(发表文章接口在显示所有文章的页面内)
// POST /posts 发表一篇文章
router.post('/', checkLogin, function(req, res, next) {
  var author = req.session.user._id;
  var title = req.fields.title;
  var content = req.fields.content;

  // 校验参数
  try {
    if (!title.length) {
      throw new Error('请填写标题');
    }
    if (!content.length) {
      throw new Error('请填写内容');
    }
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('back');
  }

  var post = {
    author: author,
    title: title,
    content: content,
    pv: 0
  };

  PostModel.create(post)
    .then(function (result) {
      // 此 post 是插入 mongodb 后的值，包含 _id
      post = result.ops[0];
      req.flash('success', '发表成功');
      // 发表成功后跳转到该文章页
      res.redirect(`/posts/${post._id}`);
    })
    .catch(next);
});


// GET /posts/:postId/edit 7、更新文章页(只有登录才能转到编辑页面)
router.get('/:postId/edit',checkLogin,function (req,res,next){
  res.send(req.flash());
});
// POST /posts/:postId/edit 8、更新一篇文章(只有登录才能进行编辑)
router.post('/:postId/edit',checkLogin,function (req,res,next){
  res.send(req.flash());
});
// POST /posts/:postId/remove 9、删除一篇文章
router.post('/:postId/remove',checkLogin,function (req,res,next){
  res.send(req.flash());
});
module.exports = router;
