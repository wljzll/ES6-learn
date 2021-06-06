/**
 * Promise是一个类，需要new这个类
 * 
 * 1、executor 执行器 在new 创建实例时默认会立即执行
 * 2、默认promise的状态是等待状态(三个状态 等待 成功 失败)
 * 3、当调用resolve时 会变成成功状态；调用reject 会变成失败状态
 * 4、返回的实例上有一个then方法，then中需要提供两个参数，分别是
 *    成功对应的函数和失败对应的函数
 * 5、如果同时调用成功和失败 默认会采取第一次调用的结果
 * 6、抛出异常就走失败的逻辑
 * 7、成功时可以传入成功的值，失败时可以传入失败的原因
 */

let Promise = require('./promise');
let promise = new Promise((resolve, reject) =>{
    console.log('123');
    setTimeout(() => {
        resolve('ok!');
    }, 1000);
    resolve('ok!');
})

promise.then(val => {
    console.log('success===', val);
}, reason => {
    console.log('err===', reason);
})
promise.then(val => {
    console.log('success===', val);
}, reason => {
    console.log('err===', reason);
})