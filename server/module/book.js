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

/**
 * 查询某读者借某本书的最新时间
 * @param {object} params json
 * @param {function} cb 回调
 */
// var getNewBorrow = async (params, cb) => {
//     let where = `where reader_number = ${params.reader_number} and book_number = ${params.book_number}`;
//     let order = `order by borrow_time desc`;
//     db.select('borrow_book', where, order, '', (err, r) =>{
//         if(err) {
//             cb(err, {code: 0, msg:'数据查询失败！'});
//         }else {
//             cb(err, {code: 1, msg:'数据查询成功！', new: r.rows[0]});
//         }
//     })
// }

/**
 * 查询某读者还某本书的最新时间
 * @param {object} params json
 * @param {function} cb 回调
 */
// var getNewReturn = async (params, cb) => {
//     let where = `where reader_number = ${params.reader_number} and book_number = ${params.book_number}`;
//     let order = `order by return_time desc`;
//     db.select('return_book', where, order, '', (err, r) => {
//         if (err) {
//             cb(err, { code: 0, msg: '数据查询失败！' });
//         } else {
//             console.log(r.rows[0])
//             cb(err, { code: 1, msg: '数据查询成功！', new: r.rows[0] });
//         }
//     })
// }

/**
 * 查询某书是否可借
 * @param {object} params json
 * @param {function} cb 回调
 */
// var vertifyBorrow = async (params, cb) => {
//     getNewBorrow(params, (err, r)=>{
//         console.log(r.new);
//         let newBorrow = r.new.borrow_time;
//         getNewReturn(params, (err, re)=>{
//             let newReturn = re.new.return_time;
//             if (newBorrow > newReturn){
//                 cb(err, {code: 0, msg:'该书已出借！'});
//             }else {
//                 cb(err, { code: 1});
//             }
//         })
//     })
// }

// var getInventory = async (params, cb)=> {
//     let where = `where book_number='${params.book_number}'`
//     db.select('book', where, '', '', (err, r1)=>{
//         if(r1.code){
//             cb(err, { code: 1, inv: r1.rows[0].inventory});
//         }else{
//             cb(err, {code: 0, msg:'获取数据失败！'});
//         }
//     })
// }

exports.vertifyBook = vertifyBook;
// exports.getNewBorrow = getNewBorrow;
// exports.getNewReturn = getNewReturn;
// exports.vertifyBorrow = vertifyBorrow;
// exports.getInventory = getInventory;