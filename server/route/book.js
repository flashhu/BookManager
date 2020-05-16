const express = require('express');
const router = express.Router();

const db = require('../module/db');
const book = require('../module/book');

router.get('/data', (req, res) => {
    db.selectAll('book', (err, r) => {
        res.json(r);
    })
})

router.post('/search', (req, res)=>{
    let whereItem = [];
    for (let key in req.body) {
        if (req.body[key] !== 'all' && req.body[key] !== '') {
            if (key === 'category') {
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
    let order = 'order by book_number';
    db.select('book', where, order, '', (err, r)=>{
        res.json(r);
    })
})

router.post('/update', (req, res) => {
    book.vertifyBook(req.body, (cb, r) => {
        if(r.code) {
            let where = {}
            where['book_number'] = req.body.book_number;
            req.body['inventory'] = req.body.book_total - r.row.book_total + r.row.inventory;
            db.modify('book', req.body, where, (err, r)=>{
                res.json(r);
            })
        }else {
            req.body['inventory'] = req.body.book_total;
            db.add('book', req.body, (err, r) => {
                res.json(r);
            })
        }
    })
})

router.post('/delete', (req, res) => {
    book.vertifyBook(req.body, (cb, r) => {
        if(r.code) {
            db.del('book', req.body, (err, r)=>{
                res.json(r);
            })
        }else {
            res.json(r);
        }
    })
})

module.exports = router;