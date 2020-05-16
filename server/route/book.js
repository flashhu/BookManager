const express = require('express');
const router = express.Router();

const db = require('../module/db');
const book = require('../module/book');
const reader = require('../module/reader');

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
    book.vertifyBook(req.body, (cb, r1) => {
        if(r1.code) {
            let where = {}
            where['book_number'] = req.body.book_number;
            req.body['inventory'] = req.body.book_total - r1.row.book_total + r1.row.inventory;
            db.modify('book', req.body, where, (err, r2)=>{
                res.json(r2);
            })
        }else {
            req.body['inventory'] = req.body.book_total;
            db.add('book', req.body, (err, r3) => {
                res.json(r3);
            })
        }
    })
})

router.post('/delete', (req, res) => {
    book.vertifyBook(req.body, (cb, r1) => {
        if(r1.code) {
            db.del('book', req.body, (err, r2)=>{
                res.json(r2);
            })
        }else {
            res.json(r1);
        }
    })
})

//回调地狱 orz
router.post('/borrow', (req, res)=>{
    reader.vertifyReader(req.body, (err, r1)=>{ //读者存在
        if (r1.code) {
            db.add('borrow_book', req.body, (err, r5) => {
                res.json(r5);
            })
            // let wheresql = `where reader_number = ${req.body.reader_number}`;
            // //借书上限
            // db.select('borrow_book', wheresql, '', '', (err, r2) => { 
            //     if (r2.code) {
            //         let borrowNum = r2.rows.length;
            //         db.select('return_book', wheresql, '', '', (err, r3)=>{
            //             if(r3.code) {
            //                 let returnNum = r3.rows.length;
            //                 if(borrowNum - returnNum >= 10) {
            //                     res.json({ code: 0, msg:'已到达借书上限！'});
            //                 }else {
            //                     //该书是否可借
            //                     book.vertifyBorrow(req.body, (err, r4)=>{
            //                         if(r4.code){
            //                             db.add('borrow_book', req.body, (err, r5) => {
            //                                 res.json(r5);
            //                             })
            //                         }else{
            //                             res.json(r4);
            //                         }
            //                     })                          
            //                 }
            //             }else{
            //                 res.json(r3);
            //             }
            //         })
            //     } else {
            //         res.json(r2);
            //     }
            // })
        }else{
            res.json({code: 0, msg:'读者不存在！'});
        }
    }) 
})

router.post('/return', (req, res) => {
    reader.vertifyReader(req.body, (err, r1) => { //读者是否存在
        if (r1.code) {
            // book.vertifyBorrow(req.body, (err, r2)=>{
            //     if(r2.code) {
            //         res.json({code: 0, msg:'该书已归还！'});
            //     }else{
            db.add('return_book', req.body, (err, r3) => {
                res.json(r3);
            })
            //     }
            // })
        } else {
            res.json({ code: 0, msg: '读者不存在！' });
        }
    })
})

module.exports = router;