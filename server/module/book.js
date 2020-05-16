const db = require('./db');

/**
 * 确认书是否存在
 * @param {object} params json 
 * @param {function} cb 回调
 */
var vertifyBook = async (params, cb) => {
    let where = `where book_number='${params.book_number}'`
    db.select('book', where, '', '', (err, ret) => {
        if (ret.rows.length > 0) {
            cb(err, { code: 1, row: ret.rows[0]})
        } else {
            cb(err, {code: 0, msg:'书本不存在！'})
        }
    })
}

exports.vertifyBook = vertifyBook;