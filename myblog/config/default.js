/*
    config-lite 是一个轻量的读取配置文件的模块。config-lite 会根据环境变量（NODE_ENV）的不同从当前执行
进程目录下的 config 目录加载不同的配置文件。如果不设置 NODE_ENV，则读取默认的 default 配置文件，如
果设置了 NODE_ENV，则会合并指定的配置文件和 default 配置文件作为配置，config-lite 支持 .js、.json、.nod
e、.yml、.yaml 后缀的文件。
如果程序以 NODE_ENV=test node app 启动，则通过 require('config-lite') 会依次降级查找 config/test.js、
config/test.json、config/test.node、config/test.yml、config/test.yaml 并合并 default 配置; 如果程序
以 NODE_ENV=production node app 启动，则通过 require('config-lite') 会依次降级查找 config/production.js、
config/production.json、config/production.node、config/production.yml、config/production.yaml 并合并
 default 配置
*/
// 凭证外化
module.exports = {
  port:3000,
  session:{//给express-session中间件的配置信息
    secret:"myblog",//防止cookie被篡改
    name:"myblog",//cookie的名称
    maxAge:2592000000//cookie过期时间
  },
  mongodb:"mongodb://localhost:27017/myblog"//session存储到mongodb的地址
  // 数据库：//数据库地址:数据库端口号/数据库名称
}
