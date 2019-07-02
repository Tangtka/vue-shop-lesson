var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods.js');

//连接mongoDB 数据库
mongoose.connect('mongodb://127.0.0.1:27017/vue_shop');
mongoose.connection.on('connected',function(){
    console.log('连接成功...')
});
mongoose.connection.on('error',function(){
    console.log('连接失败...')
});
mongoose.connection.on('disconnected',function(){
    console.log('断开连接...')
});



// 处理数据接口
router.get('/', function(req, res, next) {
    Goods.find({},function (err,doc) {
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            res.json({
                status:'0',
                msg:'',
                result:{
                    count:doc.length,
                    list:doc
                }
            })
        }
    });
});

module.exports = router;
