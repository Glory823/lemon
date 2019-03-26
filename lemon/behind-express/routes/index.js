var express = require('express');
var router = express.Router();
const mongo = require("mongodb-curd");

const baseName = "lemon";
const collLogin = "login";
const collBill = "bill";
const collIcon = "icon";
const collClass = "class";


/* GET home page. */

//登录接口---用户表
router.post('/api/login', function(req, res, next) {
    const name = req.body.name;
    const pwd = req.body.pwd;
    mongo.find(baseName, collLogin, { "name": name, "pwd": pwd }, function(result) {
        console.log(result)
        if (result.length === 0) {
            res.json({ code: 0, msg: "登录失败" });
        } else {
            res.json({
                code: 1,
                data: result,
                msg: "登录成功"
            });
        }
    })
});


// 注册接口---用户表
router.post('/api/register', function(req, res, next) {
    const name = req.body.name;
    const pwd = req.body.pwd;

    mongo.find(baseName, collLogin, { "name": name, "pwd": pwd }, function(rest) {
        if (!rest.length) {
            mongo.insert(baseName, collLogin, { "name": name, "pwd": pwd }, function(result) {
                if (result.length === 0) {
                    res.json({ code: 0, msg: "注册失败" });
                } else {
                    res.json({
                        code: 1,
                        msg: "注册成功"
                    });
                }
            })
        } else {
            res.json({ code: 3, msg: "已有账户" });
        }
    })
});


//查询账单 --- 账单表
router.post('/api/billFind', function(req, res, next) {
    const uli = req.body.uli;
	const page = req.body.page;
	const pageSize = req.body.pageSize;
    mongo.find(baseName, collBill, { "uli": uli }, function(result) {
        if (result.length === 0) {
            res.json({ code: 0, data: result});
        } else {
            res.json({ code: 1, data: result });
        }
    },{
		skip:(page-1)*pageSize,
		limit:pageSize
	})
});



//删除账单 --- 账单表
router.post('/api/billRemove', function(req, res, next) {
    const id = req.body.id;
    mongo.remove(baseName, collBill, { "_id": id }, function(result) {
        if (result.result.n === 0) {
            res.json({ code: 0, msg: "删除失败" });
        } else {
            res.json({ code: 1, msg: "删除成功" });
        }
    })

});



//添加账单 --- 账单表
router.post('/api/billInsert', function(req, res, next) {
    const body = req.body;
    mongo.insert(baseName, collBill, body, function(result) {
        if (result.result.n === 0) {
            res.json({ code: 0, msg: "增加失败" });
        } else {
            res.json({ code: 1, msg: "增加成功" });
        }
    })

});


module.exports = router;