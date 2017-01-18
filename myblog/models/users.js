var User = require('../lib/mongo').User;//引入mongolass模型用来操作数据库
module.exports = {
  //注册一个用户并将数据存储到数据库中
  create:function (user){
    return User.create(user).exec();
    // User是model的实例；User.create()是query的实例,model的所有方法都返回一个query实例
    // 只有.exec()以后才执行查询操作，并返回promise对象
    // User.create(user).exec() 本身就会返回一个Promise对象
  },
  getUserByName:function (name){
    return User
            .findOne({name:name})
            .addCreatedAt()//自定义addCreatedAt插件，返回的是游标对象
            .exec();
  }
};
