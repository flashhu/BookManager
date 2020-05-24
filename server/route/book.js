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
    let wheresql = `where book_number=${req.body.book_number}`;
    db.select('borrow_book', wheresql, '', '', (err, r1) => {
        if (r1.code) {
            if (r1.rows.length > 0) {
                res.json({ code: 0, msg: '该书存在借还记录！' });
            } else {
                db.del('book', req.body, (err, r2) => {
                    if (r2.code) {
                        if (r2.rows.affectedRows > 0) {
                            res.json(r2);
                        } else {
                            res.json({ code: 0, msg: '该书不存在！' });
                        }
                    } else {
                        res.json(r2);
                    }
                })
            }
        } else {
            res.json(r1);
        }
    })
})

//回调地狱 orz
router.post('/borrow', (req, res)=>{
    reader.vertifyReader(req.body, (err, r1)=>{ //读者存在
        if (r1.code) {
            let wherebook = `where book_number=${req.body.book_number}`;
            db.select('book', wherebook, '', '', (err, r2) => { //书本有存量
                if (r2.code && r2.rows[0].inventory > 0) {
                    let where = wherebook + ` and reader_number=${req.body.reader_number}`
                    db.select('borrow_book', where, '', '', (err, r3)=>{ //判断该读者是否已借阅该书
                        if(r3.code && r3.rows.length < 1) {
                            reader.borrowBook(req.body, (err, r4) => { //判断借书是否大于10本 执行借书操作
                                if (r4.code) {
                                    let num = {}
                                    num['inventory'] = r2.rows[0].inventory - 1;
                                    let book = {}
                                    book['book_number'] = req.body.book_number;
                                    db.modify('book', num, book, (err, r5) => { //修改读者表库存数量
                                        res.json(r4);
                                    })
                                } else {
                                    res.json(r4);
                                }
                            })
                        }else{
                            res.json({ code: 0, msg: '该借书记录已存在！' });
                        }
                    })
                    
                }else {
                    res.json({ code: 0, msg: '该书库存不足！' });
                }
            })
        }else{
            res.json({code: 0, msg:'读者不存在！'});
        }
    }) 
})

router.post('/return', (req, res) => {
    let wherebook = `where book_number=${req.body.book_number}`
    let where = wherebook + ` and reader_number=${req.body.reader_number}`;
    db.select('borrow_book', where, '', '', (err, r1)=>{ //查询借书记录是否存在
        if(r1.code) {
            if ( r1.rows.length > 0) {
                db.select('return_book', where, '', '', (err, r2) => { //判断该读者是否已还该书
                    if (r2.code && r2.rows.length < 1) {
                        db.add('return_book', req.body, (err, r3) => { //还书
                            if (r3.code && r3.rows.affectedRows > 0) {
                                db.select('book', wherebook, '', '', (err, r4) => { //获取当前书本的存量
                                    if (r4.code) {
                                        let num = {}
                                        num['inventory'] = r4.rows[0].inventory + 1;
                                        let book = {}
                                        book['book_number'] = req.body.book_number;
                                        db.modify('book', num, book, (err, r5) => { //修改书本存量
                                            res.json(r5);
                                        })
                                    }
                                })
                            } else {
                                res.json(r3);
                            }
                        })
                    }else{
                        res.json({code: 0, msg: '该还书记录已存在！'});
                    }
                })
            }else{
                res.json({code: 0, msg: '该借书记录不存在！'});
            }
        }else {
            res.json(r1);
        }
    })
})

module.exports = router;