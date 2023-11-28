/**
 * Promise是一个类，需要new这个类型
 * 
 * 1、executor 执行器 默认会立即执行
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
    setTimeout(() => {
        reject('ok!');
    }, 1000);
})

promise.then(val => {
    console.log('success===', val);
    return '第一个then成功回调的返回值'
}, reason => {
    console.log('err===', reason);
    return '第一个then错误回调的返回值'
})
// .then(val => {
//     console.log('success===', val);
// }, reason => {
//     console.log('err===', reason);
// })

/**
 * 1. Promise类接受一个回调函数作为参数, Promise在内部执行这个回调函数的时候
 *    会给这个回调函数传递两个参数 resolve/reject, 使用者自行决定这个Promise
 *    实例是成功还是失败
 * 
 * 2. 当执行Promise实例的then方法时, 需要给then方法传递两个参数, Promise实例
 *    resolve时执行的回调, Promise实例reject时执行的回调, then方法执行时, 
 *    如果Promise实例已经resolve或reject了就会立即执行对应的回调并将resolve/reject
 *    的参数传递个相应的回调, 如果此时Promise实例还是pending, 那么对应的回调会在
 *    resolve/reject时执行
 * 
 * 3. then方法执行会返回一个新的Promise实例: 如果then的成功或失败的回调返回一个非
 *    Promise实例, 那么then方法返回的Promise实例会立即resolve
 */