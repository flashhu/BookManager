const db = require('./db');

/**
 * 确认读者是否存在
 * @param {object} params json 
 * @param {function} cb 回调
 */
var vertifyReader = async (params, cb) => {
    let where = `where reader_number='${params.reader_number}'`
    db.select('reader', where, '', '', (err, ret) => {
        if (ret.rows.length > 0) {
            cb(err, { code: 1, row: ret.rows[0] })
        } else {
            cb(err, { code: 0, msg: '该读者不存在！' })
        }
    })
}

/**
 * 读者当前借了几本书
 * @param {object} params json 
 * @param {function} cb 回调
 */
var getCurrentBorrow = async (params, cb) => {
    let where = `where reader_number='${params.reader_number}'`
    db.select('borrow_book', where, '', '', (err, r1)=>{
        if(r1.code) {
            db.select('return_book', where, '', '', (err, r2)=>{
                if(r2.code) {
                    cb(err, {code: 1, len: r1.rows.length - r2.rows.length})
                }else{
                    cb(err, {code: 0})
                }
            })
        }else {
            cb(err, {code: 0})
        }
    })
}

var borrowBook = async (params, cb) => {
    getCurrentBorrow(params, (err, r1) => {
        if(r1.code) {
            if(r1.len < 10) {
                db.add('borrow_book', params, (err, r2) => {
                    cb(err, { code: 1, msg: '借书成功！'});
                })
            }else{
                cb(err, { code: 0, msg: '该读者已达到借书上限！' });
            }
        }else{
            cb(r1)
        }
    });
}

exports.vertifyReader = vertifyReader;
exports.borrowBook = borrowBook;