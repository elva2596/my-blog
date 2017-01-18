var config  = require('config-lite');
var Mongolass = require('mongolass');

var mongolass =  new Mongolass();
mongolass.connect(config.mongodb);//连接数据库mongolass.connect(mongodb://localhost:27017/myblog)
var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');

// 根据id生成创建时间created_at

mongolass.plugin('addCreatedAt',{
  afterFind:function (results){
    results.forEach(function (item){
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
    });
    return results;
  },
  afterFindOne:function (result){
    if(result){
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
    }

    return result;
  }

})


//使用mongolass创建一个schema,并由schema发布一个model,mongolass中的model相当于mongodb中的collection
exports.User = mongolass.model('User',{
  name:{type:'string'},
  password:{type:'string'},
  avatar:{type:'string'},//头像
  gender:{type:'string',enum:['m','f','x']},//enum:['m','f','x']性别只能有三种选择
  bio:{type:'string'}
});
exports.User.index({name:1},{unique:true}).exec();// 根据用户名找到用户，用户名全局唯一
//mongolass中model来控制数据库增删改查,并且model的每一个方法都会返回一个query实例
// 因此可以继续执行exec最终返回promise对象
exports.Post = mongolass.model('Post',{
  author:{type:Mongolass.Types.ObjectId},
  title:{type:"string"},
  content:{type:"string"},
  pv:{type:"number"}
})
exports.Post.index({author:1,_id:-1}).exec();//首先按照作者的ID生序排列，如果是同一个作者，则按照创建时间降序排列
