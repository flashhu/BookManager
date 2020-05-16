const express = require('express');
const router = express.Router();

const user = require('../module/user');
const db = require('../module/db');
const { genPassword } = require('../utils/crypto');

router.post('/register', (req, res)=>{
    let tmp = {};
    tmp['manager_id'] = req.body.id;
    tmp['name'] = req.body.name;
    tmp['telephone'] = req.body.phone;
    tmp['password'] = genPassword(req.body.passwd);
    user.vertifyUser(tmp, (err, r)=>{
        if(r.code) {
            res.json({code: 0, msg:'用户已存在！'});
        }else {
            db.add('manager', tmp, (err, r2)=>{
                res.json(r2);
            })
        }
    })
})

router.post('/login', (req, res)=>{
    req.body.password = genPassword(req.body.password);
    user.vertifyUser(req.body, (err, r) => {
        if (!r.code) {
            res.json({ code: 0, msg: '用户不存在！' });
        } else {
            let where = `where manager_id='${req.body.manager_id}' and password='${req.body.password}'`;
            db.select('manager', where, '', '', (err, r2)=>{
                if (r2.rows.length > 0) {
                    res.status(200).json({ code: 1, msg: '登录成功！', user: r2.rows[0] });
                }else {
                    res.status(200).json({ code: 0, msg: '用户名或密码不正确！' });
                }
            })
        }
    })
})

module.exports = router;