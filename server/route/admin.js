const express = require('express');
const router = express.Router();

const db = require('../module/db');
const user = require('../module/user');
const { genPassword } = require('../utils/crypto');

router.get('/data', (req, res) => {
    db.selectAll('manager', (err, r) => {
        res.json(r);
    })
})

router.post('/search', (req, res) => {
    let whereItem = [];
    for (let key in req.body) {
        if (req.body[key] !== '') {
            whereItem.push(`${key} like '%${req.body[key]}%'`);
        }
    }
    let where = '';
    if (whereItem.length > 0) {
        where = `where ${whereItem.join(' and ')}`;
    }
    let order = 'order by manager_id';
    db.select('manager', where, order, '', (err, r) => {
        res.json(r);
    })
})

router.post('/update', (req, res) => {
    user.vertifyUser(req.body, (cb, r) => {
        if (r.code) {
            let where = {}
            where['manager_id'] = req.body.manager_id;
            db.modify('manager', req.body, where, (err, r2) => {
                res.json(r2);
            })
        } else {
            //密码默认123456
            req.body['password'] = genPassword('123456');
            db.add('manager', req.body, (err, r3) => {
                res.json(r3);
            })
        }
    })
})

router.post('/delete', (req, res) => {
    user.vertifyUser(req.body, (cb, r) => {
        if (r.code) {
            db.del('manager', req.body, (err, r2) => {
                res.json(r2);
            })
        } else {
            res.json(r);
        }
    })
})

module.exports = router;