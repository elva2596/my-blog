var Post = require('../lib/mongo').Post;
module.exports = {
  create:function (post){
    return Post.create(post).exec();
  }
}
