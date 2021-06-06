/**
 * then的使用方式：
 * 1、then中的回调有两个方法，成功或者失败，他们返回的结果(普通值)会传递给外层的下一个then中
 * 2、可以在成功和失败中抛出异常，会走到下一个then的失败中
 * 3、返回值是一个promise，那么会用这个promise的状态作为结果，会用promise的结果向下传递
 * 4、错误处理 是默认先找离自己最近的错误处理，找不到向下查找，找到后执行
 */
const ENUM = {
  PENDING: "PENDING",
  FULFILLED: "FULFILLED",
  REJECTED: "REJECTED",
};
/**
 * 根据上一个then方法的返回值决定返回的promise2的状态
 * @param {*} x 上一个then的返回值 可能是简单类型 也可能是Object、Function、Promise等
 * @param {*} promise2 上一个then方法返回的promise
 * @param {*} resovle 上一个then方法返回的promise的resolve函数
 * @param {*} reject 上一个then方法返回的promise的reject函数
 */
function resovlePromise(x, promise2, resovle, reject) {
  // 根据x(上一个promise then方法的返回值)来解析promise2是成功还是失败
  if (x === promise2) {
    reject(`TypeError: Chaining cycle detected for promise #<Promise>`)
  }

  // 如果x是一个promise 那么就采用它的状态
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {

    let called; // 防止被多次调用resolve/reject，或者先后调用resolve/reject，或者其他先后调用的情况

    // x是一个对象或一个函数
    try {
      // 在取then方法时可能会报错（例如使用defineprotity定义）
      let then = x.then;
      // 有then说明是一个promise
      if (typeof then == 'function') {
        // 调用promise2的then方法
        then.call(x, y => {
          if (called) return;
          called = true;
          //promise2resolve的这个y 也可能是一个promise
          resovlePromise(y, promise2, resovle, reject);
        }, r => {
          if (called) return;
          called = true;
          reject(r);
        })
      } else { // 不是promise直接resolve
        resovle(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    // 普通值直接resolve
    resovle(x);
  }

}
class Promise {
  constructor(executor) {
    this.status = ENUM.PENDING;
    this.value = null;
    this.reason = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    const resovle = (value) => {
      // 调用Promise.resolve时，如果value是一个Promise
      if (value instanceof Promise) {
        value.then(resovle, reject);
      }
      if (this.status === "PENDING") {
        this.status = ENUM.FULFILLED;
        this.value = value;
        this.onFulfilledCallbacks.forEach((fn) => fn());
      }
    };
    const reject = (reason) => {
      if (this.status === "PENDING") {
        this.status = ENUM.REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };
    try {
      executor(resovle, reject);
    } catch (error) {
      reject(error);
    }
  }
  then(onFulfilled, onRejected) {
    // 实现穿透效果
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
    let promise2 = new Promise((resovle, reject) => {
      if (this.status === ENUM.FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resovlePromise(x, promise2, resovle, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      if (this.status === ENUM.REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resovlePromise(x, promise2, resovle, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      if (this.status === ENUM.PENDING) {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resovlePromise(x, promise2, resovle, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resovlePromise(x, promise2, resovle, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });
    return promise2;
  }
  catch(errorCallback) {
    return this.then(null, errorCallback);

  }
  static resolve(val) {
    return new Promise((resolve, reject) => {
      resolve(val);
    })
  }
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    })
  }
}
module.exports = Promise;
