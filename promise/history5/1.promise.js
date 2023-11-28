
// let Promise = require('./promise')
// Promise.reject(100).finally(() => {
//   console.log('finally', 1);
// }).then(data => { // 这个then方法其实是一个新的Promise的then，但是可以接收原始Promise的resolve/reject的值
//   console.log('success', data);
// }).catch(err => {
//   console.log('catch', err);
// })

// let p1 = new Promise((resolve, reject) => {
//   reject(1)
// }).then(data => {
//   console.log('success', data);
// }, err => {
//   console.log('then err', err);
//   throw err
// }).catch(err => { // 这里的catch捕获的是then方法返回的Promise的异常， 如果then方法中没有传递 错误的回调，会默认将err抛出，就会传递到返回的Promise的then方法中
//   console.log('catch', err);
// })

const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(123)
  }, 1000);
})

promise1.then(() => {
  return 123
}).finally((value) => {
  console.log(value);
})