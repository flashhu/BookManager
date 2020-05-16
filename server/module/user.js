const db = require('./db');

/**
 * 确认账户是否存在
 * @param {object} params json 
 * @param {function} cb 回调
 */
var vertifyUser = async (params, cb) => {
    let where = `where manager_id='${params.manager_id}'`
    db.select('manager', where, '', '', (err, ret) => {
        if (ret.rows.length > 0) {
            cb(err, { code: 1, row: ret.rows[0] })
        } else {
            cb(err, { code: 0, msg: '该管理员不存在！' })
        }
    })
}

exports.vertifyUser = vertifyUser;