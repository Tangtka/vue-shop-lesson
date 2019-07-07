var express = require('express');
var router = express.Router();
var Goods = require('../models/goods.js');
var Users = require('../models/users.js');


// 处理数据接口
router.get('/list', (req, res, next) => {
    let page = parseInt(req.param('page'));
    let pageSize = parseInt(req.param('pageSize'));
    let sort = parseInt(req.param('sort'));  //1升序 -1降序
    let priceLevel = req.param('priceLevel');
    let skip = (page - 1) * pageSize;
    let params = {};
    let priceGt = '';
    let pricrLte = '';

    if (priceLevel !== 'all') {
        switch (priceLevel) {
            case '0':
                priceGt = 0;
                pricrLte = 100;
                break;
            case '1':
                priceGt = 100;
                pricrLte = 500;
                break;
            case '2':
                priceGt = 500;
                pricrLte = 1000;
                break;
            case '3':
                priceGt = 1000;
                pricrLte = 2000;
                break;
            case '4':
                priceGt = 2000;
                pricrLte = 3000;
                break;
            case '5':
                priceGt = 3000;
                pricrLte = 6000;
                break;
        }

        params.salePrice = {
            $gt: priceGt,
            $lte: pricrLte
        };
    }


    let goodModel = Goods.find(params).skip(skip).limit(pageSize).sort({'salePrice': sort});
    goodModel.exec((err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            })
        } else {
            res.json({
                status: '0',
                msg: '',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    });
});


//加入购物车
router.post('/addCart', (req, res, next) => {
    var userId = '100000077';
    var productId = req.body.productId;
    var goodsItem = '';

    Users.findOne({userId: userId}, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            })
        } else {
            if (doc) {
                //遍历购物车，是否存在商品，存在+1
                doc.cartList.forEach((item) => {
                    if(item.productId === productId){
                        goodsItem = item;
                        item.productNum++;
                    }
                });

                if(goodsItem){
                    doc.save((err2,doc2)=>{
                        if(err2){
                            res.json({
                                status: '1',
                                msg: err2.message
                            })
                        }else{
                            res.json({
                                status: '0',
                                msg: '',
                                result: 'success'
                            })
                        }
                    })
                }else{
                    Goods.findOne({productId: productId}, (err3, doc3) => {
                        if(err3){
                            res.json({
                                status: '1',
                                msg: err3.message
                            })
                        }else{
                            if(doc3){
                                doc3.productNum = 1;
                                doc3.checked = 1;
                                doc.cartList.push(doc3);

                                doc.save((err4,doc4)=>{
                                    if(err4){
                                        res.json({
                                            status: '1',
                                            msg: err4.message
                                        })
                                    }else{
                                        res.json({
                                            status: '0',
                                            msg: '',
                                            result: 'success'
                                        })
                                    }
                                })
                            }

                        }
                    })
                }
            }
        }
    })
});

//查询当前购物车数据
router.get('/cartList', (req, res, next) => {
    var userId = req.cookies.userId;

    Users.findOne({userId: userId}, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            })
        } else {
            if (doc) {
                res.json({
                    status: '0',
                    msg: '',
                    result:doc.cartList
                })
            }
        }
    })
});

//删除购物车数据
router.post('/cartDel', (req, res, next) => {
    var userId = req.cookies.userId;
    var productId = req.body.productId;
    Users.update({
        userId: userId
    },{
        $pull:{
            'cartList':{
                'productId':productId
            }
        }
    }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            })
        } else {
            if (doc) {
                res.json({
                    status: '0',
                    msg: '',
                    result:'success'
                })
            }
        }
    })
});

//修改商品数量
router.post('/cartEdit', (req, res, next) => {
    var userId = req.cookies.userId;
    var productId = req.body.productId;
    var productNum = req.body.productNum;
    var checked = req.body.checked;


    Users.update({
        'userId': userId,
        'cartList.productId':productId
    },{
        'cartList.$.productNum':productNum,
        'cartList.$.checked':checked,
    }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            })
        } else {
            if (doc) {
                res.json({
                    status: '0',
                    msg: '',
                    result:'success'
                })
            }
        }
    })
});

//购物车全选
router.post('/editCheckAll', (req, res, next) => {
    var userId = req.cookies.userId;
    var checkAll = req.body.checkAll;


    Users.findOne({
        'userId': userId,
    },(err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            })
        } else {
            if (doc) {
                console.log(checkAll);
                doc.cartList.forEach((item)=>{
                   item.checked =  checkAll
                });
                doc.save((err1, doc1)=>{
                    if (err1) {
                        res.json({
                            status: '1',
                            msg: err1.message
                        })
                    } else {
                        if (doc1) {
                            res.json({
                                status: '0',
                                msg: '',
                                result:'success'
                            })
                        }
                    }
                });
            }
        }
    })
});

module.exports = router;
