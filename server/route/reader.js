const express = require('express');
const router = express.Router();

const db = require('../module/db');
const reader = require('../module/reader');

router.get('/data', (req, res) => {
    db.selectAll('reader', (err, r) => {
        res.json(r);
    })
})

router.post('/search', (req, res) => {
    let whereItem = [];
    for (let key in req.body) {
        if (req.body[key] !== 'all' && req.body[key] !== '') {
            if (key === 'department') {
                whereItem.push(`${key}='${req.body[key]}'`);
            } else {
                whereItem.push(`${key} like '%${req.body[key]}%'`);
            }
        }
    }
    let where = '';
    if (whereItem.length > 0) {
        where = `where ${whereItem.join(' and ')}`;
    }
    let order = 'order by reader_number';
    db.select('reader', where, order, '', (err, r) => {
        res.json(r);
    })
})

router.post('/update', (req, res) => {
    reader.vertifyReader(req.body, (cb, r) => {
        if (r.code) {
            let where = {}
            where['reader_number'] = req.body.reader_number;
            db.modify('reader', req.body, where, (err, r2) => {
                res.json(r2);
            })
        } else {
            db.add('reader', req.body, (err, r3) => {
                res.json(r3);
            })
        }
    })
})

router.post('/delete', (req, res) => {
    let wheresql = `where reader_number=${req.body.reader_number}`;
    db.select('borrow_book', wheresql, '', '', (err, r1) => {
        if(r1.code) {
            if(r1.rows.length > 0) {
                res.json({ code: 0, msg: '该读者存在借还书记录！' });
            }else {
                db.del('reader', req.body, (err, r2) => {
                    if (r2.code) {
                        if (r2.rows.affectedRows > 0) {
                            res.json(r2);
                        } else {
                            res.json({ code: 0, msg: '该读者不存在！' });
                        }
                    } else {
                        res.json(r);
                    }
                })
            }
        }else {
            res.json(r1);
        }
    })

})

module.exports = router;