var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//连接mongoDB 数据库
mongoose.connect('mongodb://127.0.0.1:27017/vue-shop');
mongoose.connection.on('connected',()=>{
    console.log('连接成功...')
});
mongoose.connection.on('error',()=>{
    console.log('连接失败...')
});
mongoose.connection.on('disconnected',()=>{
    console.log('断开连接...')
});



// 处理数据接口
// router.get('/', function(req, res, next) {
//     res.render('index', { title: 'Express' });
// });

module.exports = router;