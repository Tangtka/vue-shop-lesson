var express = require('express');
var router = express.Router();
var Users = require('../models/users.js');


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
                res.cookie('userId', doc.userId, {
                    path: '/',
                    maxAge: 100 * 60 * 60
                });
                res.cookie('userName', doc.userName, {
                    path: '/',
                    maxAge: 100 * 60 * 60
                })
            }
            res.json({
                status: '0',
                msg: '',
                result: {
                    userId: doc.userId,
                    userName: doc.userName
                }
            })
        }
    })
});

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

module.exports = router;
