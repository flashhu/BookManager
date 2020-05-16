const mysql = require('mysql');
const config = require('./config');
const pool = mysql.createPool(config);

/**
 * json转为键值对数组
 * @param {object} obj json对象
 * @param {Array} keys 键值
 * @param {Array} values 值
 * @param {Array} param 键值对 等号连接
 */
var prepareParm = (obj, keys, values, param) => {
    for (let key in obj) {
        let val = obj[key];
        // console.log('typeof(val)', typeof (val));
        keys.push(key)
        if (typeof (val) === 'string') {
            values.push(`'${val}'`);
            param.push(`${key}='${val}'`);
        } else if (val instanceof Array) {
            values.push(`'${val.join('|')}'`);
            param.push(`${key}='${val}'`);
        } else {
            values.push(`${val}`);
            param.push(`${key}=${val}`);
        }
    }
}

/**
 * 通用查询语句
 * @param {string} sql 查询语句
 * @param {function} cb 回调
 */
var querySQL = async (sql, cb) => {
    pool.getConnection((err, conn) => {
        if (err) {
            console.log('Connect error', err);
            cb(err, {code: -1, msg:'连接失败！'});
        } else {
            conn.query(sql, (err, rows) => {
                if (err) {
                    console.log('SQL error', err);
                    cb(err, { code: 0, msg: '数据获取失败！' })
                } else {
                    cb(err, { code: 1, msg: '数据获取成功！', rows: rows })
                }
                conn.release();
            })
        }
    })
};

/**
 * 查询语句
 * @param {string} table 表名
 * @param {string} where 完整where语句
 * @param {string} order 完整order语句
 * @param {string} limit 完整limit语句
 * @param {function} cb 回调
 */
var select = async (table, where, order, limit, cb) => {
    pool.getConnection((err, conn) => {
        if (err) {
            console.log('Connect error', err);
            cb(err, { code: -1, msg: '连接失败！' });
        } else {
            let sql = `select * from ${table} ${where} ${order} ${limit}`;
            conn.query(sql, (err, rows) => {
                if (err) {
                    console.log('SQL error', err);
                    cb(err, { code: 0, msg: '数据获取失败！' })
                } else {
                    cb(err, { code: 1, msg: '数据获取成功！', rows: rows })
                }
                conn.release();
            })
        }
    })
};

/**
 * 通用查询所有记录
 * @param {string} table 表名
 * @param {string} cb 回调
 */
var selectAll = async (table, cb) => {
    pool.getConnection((err, conn) => {
        if (err) {
            console.log('Connect error', err);
            cb(err, { code: -1, msg: '连接失败！' });
        } else {
            let sql = `select * from ${table}`;
            // console.log(sql);
            conn.query(sql, (err, rows) => {
                if (err) {
                    console.log('SQL error', err);
                    cb(err, { code: 0, msg: '数据获取失败！' })
                } else {
                    cb(err, { code: 1, msg: '数据获取成功！', rows: rows })
                }
                conn.release();
            })
        }
    })
};

/**
 * 删除语句
 * @param {string} table 表名
 * @param {object} where json
 * @param {function} cb 回调
 */
var del = async (table, where, cb) => {
    pool.getConnection((err, conn) => {
        if (err) {
            console.log('Connect error', err);
            cb(err, { code: -1, msg: '连接失败！' });
        } else {
            let whereSql = []
            prepareParm(where, [], [], whereSql)
            whereSql = whereSql.join(' and ')
            let sql = `delete from ${table} where ${whereSql}`
            // console.log(sql)
            conn.query(sql, (err, rows) => {
                if (err) {
                    console.log('SQL error', err)
                    cb(err, { code: 0, msg: '数据删除失败！' })
                } else {
                    cb(err, { code: 1, msg: '数据删除成功！', rows: rows })
                }
                conn.release()
            })
        }
    })
};

/**
 * 插入语句
 * @param {string} table 表名
 * @param {object} params json
 * @param {function} cb 回调
 */
var add = async (table, params, cb) => {
    pool.getConnection((err, conn) => {
        if (err) {
            console.log('Connect error', err);
            cb(err, { code: -1, msg: '连接失败！' });
        } else {
            let fieldList = []
            let valList = []
            prepareParm(params, fieldList, valList, [])
            sql = `insert into ${table} (${fieldList.join(',')}) values(${valList.join(',')})`;
            // console.log(sql)
            conn.query(sql, (err, rows) => {
                if (err) {
                    console.log('SQL error', err)
                    cb(err, { code: 0, msg: '数据添加失败！' })
                } else {
                    cb(err, { code: 1, msg: '数据添加成功！', rows: rows })
                }
                conn.release()
            })
        }
    })
};

/**
 * 修改语句
 * @param {string} table 表名
 * @param {object} params json
 * @param {object} where json
 * @param {function} cb 回调
 */
var modify = async (table, params, where, cb) => {
    pool.getConnection((err, conn) => {
        if (err) {
            console.log('Connect error', err);
            cb(err, { code: -1, msg: '连接失败！' });
        } else {
            let setSql = [];
            let whereSql = [];
            prepareParm(params, [], [], setSql);
            prepareParm(where, [], [], whereSql);
            sql = `update ${table} set ${setSql.join(',')} where ${whereSql.join(' and ')}`;
            // console.log(sql)
            conn.query(sql, (err, rows) => {
                if (err) {
                    console.log('SQL error', err)
                    cb(err, { code: 0, msg: '数据更新失败！' })
                } else {
                    cb(err, { code: 1, msg: '数据更新成功！', rows: rows })
                }
                conn.release()
            })
        }
    })
};

exports.select = select;
exports.selectAll = selectAll;
exports.querySQL = querySQL;
exports.add = add;
exports.del = del;
exports.modify = modify;
exports.prepareParm = prepareParm;