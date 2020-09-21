/*
 * @Author: ting.gao
 * @Date: yyyy-09-Tu 11:35:16 
 * @Last Modified by:   ting.gao
 * @Description https://cn.eslint.org/docs/user-guide/configuring
 */

module.exports = {
    "parser": "babel-eslint", // 解析器
    "extends": "airbnb-base", // 继承多个的话 可使用数组
    // 一个环境定义了一组预定义的全局变量
    "env": {
        "browser": true,
        "node": true,
    },
    // 规则配置 off-0 warning-1 error-2
    "rules": {
    },
}; 