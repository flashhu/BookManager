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

exports.vertifyReader = vertifyReader;