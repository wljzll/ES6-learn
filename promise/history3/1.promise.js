let Promise = require('./promise')

// 情况1：promise1的then中返回promise2自己
// let promise1 = new Promise((resovle, reject)=> {
//    resovle('ok!');
// });


// let promise2 = promise1.then(()=>{
//     return promise2; // 这就造成了promise2等待promise2自己resolve
// });

// promise2.then(null, (error) =>{
//    console.log(error);
// });

// 情况2：promise1的then方法可能也返回一个Promise
let promise1 = new Promise((resovle, reject) => {
  resovle('ok!');
});


let promise2 = promise1.then(() => {
  return new Promise((resolve, reject) => {
     resolve(); 
  }).then((y) => {

  }, (r) => {

  });
});

promise2.then(null, (error) => {
  console.log(error);
});


// 情况3：promise1的then方法返回的promise可能resolve了一个promise
let promise1 = new Promise((resovle, reject) => {
  resovle('ok!');
});


let promise2 = promise1.then(() => {
  return new Promise((resolve, reject) => {
     resolve(new Promise((resolve, reject)=> {
       resovle('123');
     })); 
  }).then((y) => {

  }, (r) => {

  });
});

promise2.then(null, (error) => {
  console.log(error);
});


// 例一、x.then的报错情况
let obj = {};
Object.defineProperty(obj, 'then', {
  get() {
    throw new Error('出错');
  }
});
obj.then

// 例二、x.then的报错情况
let obj = {};
Object.defineProperty(obj, 'then', {
  get() {
    resolve();
    throw new Error('出错');
  }
});
obj.then