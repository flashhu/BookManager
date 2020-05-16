const crypto = require('crypto');

//密钥
const SCRET_KRY = 'DBt_gf#';

//md5 加密
function md5(content) {
    let md5 = crypto.createHash('md5');
    return md5.update(content).digest('hex'); //输出16进制
}

//加密函数
function genPassword(password) {
    const str = `pwd${password}&skey{SCRET_KRY}`; //自定拼接方式，包含密钥
    return md5(str);
}

module.exports = { genPassword };