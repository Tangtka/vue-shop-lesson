var express = require('express');
var router = express.Router();
var Users = require('../models/users.js');
require('../util/date_format.js');

// 登录
router.post('/login', function (req, res, next) {

    var params = {
        userName: req.body.userName,
        userPwd: req.body.userPwd,
    };
    Users.findOne(params, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            })
        } else {
            if (doc) {
                res.cookie("userId", doc.userId, {
                    path: '/',
                    maxAge: 1000 * 60 * 60
                });
                res.cookie("userName", doc.userName, {
                    path: '/',
                    maxAge: 1000 * 60 * 60
                })
                res.json({
                    status: '0',
                    msg: '',
                    result: {
                        userId: doc.userId,
                        userName: doc.userName
                    }
                })
            }

        }
    })
});
// 注册
router.post('/register', function (req, res, next) {

    var params = {
        userName: req.body.userName,
        userPwd: req.body.userPwd,
    };
    Users.findOne(params, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            })
        } else {
            if (doc) {
                res.json({
                    status: '1',
                    msg: '已存在该用户'
                })
            }else{
                let userId = '598'+new Date().getTime();
                Users.create({
                    "userId":userId,
                    "userName":params.userName,
                    "userPwd":params.userPwd,
                    "orderList":[],
                    "cartList":[],
                    "addressList":[]
                }, function (err1, doc1) {
                    if (err1) {
                        res.json({
                            status: '1',
                            msg: err1.message
                        })
                    } else {
                        res.cookie("userId", userId, {
                            path: '/',
                            maxAge: 1000 * 60 * 60
                        });
                        res.cookie("userName", params.userName, {
                            path: '/',
                            maxAge: 1000 * 60 * 60
                        });
                        res.json({
                            status: '0',
                            msg: '',
                            result: {
                                userId: userId,
                                userName: params.userName
                            }
                        })
                    }
                })
            }

        }
    })
});

// 登出
router.post('/logout', function (req, res, next) {

    res.cookie('userId', '', {
        path: '/',
        maxAge: -1
    });
    res.cookie('userName', '', {
        path: '/',
        maxAge: -1
    });

    res.json({
        status: '0',
        msg: '',
        result: {}
    });
});


// 检查登录状态
router.get('/checkLogin', function (req, res, next) {
    if (req.cookies.userId) {
        res.json({
            status: '0',
            msg: '',
            result: {
                userId: req.cookies.userIdd,
                userName: req.cookies.userName,
            }
        });
    } else {
        res.json({
            status: '1',
            msg: '未登录',
            result: {}
        });
    }

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
                    result: doc.cartList
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
    }, {
        $pull: {
            'cartList': {
                'productId': productId
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
                    result: 'success'
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
        'cartList.productId': productId
    }, {
        'cartList.$.productNum': productNum,
        'cartList.$.checked': checked,
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
                    result: 'success'
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
    }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            })
        } else {
            if (doc) {
                console.log(checkAll);
                doc.cartList.forEach((item) => {
                    item.checked = checkAll
                });
                doc.save((err1, doc1) => {
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
                                result: 'success'
                            })
                        }
                    }
                });
            }
        }
    })
});

//查询用户地址
router.get('/addressList', (req, res, next) => {
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
                    result: doc.addressList
                })
            }
        }
    })
});
// 新增地址
router.post('/addAddress', function (req, res, next) {

    var params = {
        streetName: req.body.streetName,
        tel: req.body.tel,
        postCode: req.body.postCode,
        userId:req.cookies.userId
    };
    Users.findOne({userId:params.userId}, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            })
        } else {

            if (doc) {
                let addressId = '875'+ new Date().getTime();
                doc.addressList.push({
                    "addressId": addressId,
                    "userName": req.cookies.userName,
                    "streetName": params.streetName,
                    "postCode": params.postCode,
                    "tel": params.tel,
                    "isDefault": false
                });
                doc.save((err1,doc1)=>{
                    if(err1){
                        res.json({
                            status: '1',
                            msg: err1.message
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
                res.json({
                    status: '1',
                    msg: '不存在改用户'
                })

            }

        }
    })
});

//设置默认地址接口
router.post('/setDefault', (req, res, next) => {
    var userId = req.cookies.userId;
    var addressId = req.body.addressId;

    if (!addressId) {
        res.json({
            status: '10002',
            msg: 'addressId is null'
        })
    } else {
        Users.findOne({userId: userId}, (err, doc) => {
            if (err) {
                res.json({
                    status: '1',
                    msg: err.message
                })
            } else {
                if (doc) {
                    doc.addressList.forEach((item) => {
                        if (item.addressId === addressId) {
                            item.isDefault = true
                        } else {
                            item.isDefault = false
                        }
                    });

                    doc.save((err1, doc1) => {
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
                                    result: 'success'
                                })
                            }
                        }
                    });
                }
            }
        })
    }
});

//删除地址接口
router.post('/delAddress', (req, res, next) => {
    var userId = req.cookies.userId;
    var addressId = req.body.addressId;

    if (!addressId) {
        res.json({
            status: '10002',
            msg: 'addressId is null'
        })
    } else {
        Users.update({
            userId: userId
        }, {
            $pull: {
                'addressList': {
                    'addressId': addressId
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
                        result: 'success'
                    })
                }
            }
        })
    }
});

//付款结算功能的实现
router.post('/payMent', (req, res, next) => {
    var userId = req.cookies.userId;
    var addressId = req.body.addressId;
    var orderTotal = req.body.orderTotal;

    Users.findOne({userId: userId}, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            })
        } else {
            var address = '';
            var goodsList = [];

            //获取用户当前地址
            doc.addressList.forEach((item)=>{
                if(addressId === item.addressId){
                    address = item;
                }
            });

            //获取用户当前地址
            doc.cartList.filter((item)=>{
                if(item.checked === '1'){
                    goodsList.push(item);
                }
            });

            var platform = '598';
            var r1 = Math.floor(Math.random()*10);
            var r2 = Math.floor(Math.random()*10);
            var sysDate = new Date().Format('yyyyMMddhhmmss');
            var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
            var orderId = platform + r1 + sysDate +r2;

            var order = {
                orderId:orderId,
                orderTotal:orderTotal,
                addresInfo:address,
                goodsList:goodsList,
                orderStatus:'1',
                createDate:createDate,
            };

            doc.orderList.push(order);

            doc.save((err1, doc1) => {
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
                            result:order.orderId
                        })
                    }
                }
            });
        }
    })

});


//订单查询
router.post('/orderDetail', (req, res, next) => {
    var userId = req.cookies.userId;
    var orderId = req.body.orderId;

    Users.findOne({userId: userId}, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            })
        } else {
            //获取订单信息
            doc.orderList.filter((item)=>{
                if(item.orderId === orderId){
                    res.json({
                        status: '0',
                        msg: '',
                        result:{
                            orderId:item.orderId,
                            orderTotal:item.orderTotal
                        }
                    })
                }
            });
        }
    })

});

/* 获取购车商品数量 */
router.get("/getCartCount", function (req,res,next) {
    if(req.cookies && req.cookies.userId){
        var userId = req.cookies.userId;
        Users.findOne({"userId":userId}, function (err,doc) {
            if(err){
                res.json({
                    status:"0",
                    msg:err.message
                });
            }else{
                let cartList = doc.cartList;
                let cartCount = 0;
                cartList.map(function(item){
                    cartCount += parseFloat(item.productNum);
                });
                res.json({
                    status:"0",
                    msg:"",
                    result:cartCount
                });
            }
        });
    }else{
        res.json({
            status:"0",
            msg:"当前用户不存在"
        });
    }
});
module.exports = router;
