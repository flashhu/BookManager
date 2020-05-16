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
            db.modify('reader', req.body, where, (err, r) => {
                res.json(r);
            })
        } else {
            db.add('reader', req.body, (err, r) => {
                res.json(r);
            })
        }
    })
})

router.post('/delete', (req, res) => {
    reader.vertifyReader(req.body, (cb, r) => {
        if (r.code) {
            db.del('reader', req.body, (err, r) => {
                res.json(r);
            })
        } else {
            res.json(r);
        }
    })
})

module.exports = router;