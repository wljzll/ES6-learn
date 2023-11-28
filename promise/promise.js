// 实现 all方法
/**
 * all:
 * 1) 所有传入的Promise成功，才会成功
 * 2) 有一个Promise失败就失败
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
    // 这里必须要这样抛异常才能通过测试
    reject(new TypeError("Chaining cycle detected for promise #<Promise>"));
  }

  // 如果x是一个promise 那么就采用它的状态
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    let called; // 防止被多次调用resolve/reject，或者先后调用resolve/reject，或者其他先后调用的情况

    // x是一个对象或一个函数
    try {
      // 在取then方法时可能会报错（例如使用defineprotity定义）
      let then = x.then;
      // 有then说明是一个promise
      if (typeof then == "function") {
        // 调用promise2的then方法
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            //promise2resolve的这个y 也可能是一个promise
            resovlePromise(y, promise2, resovle, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        // 不是promise直接resolve
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
        // 递归解析 当Promise.resolve()传入的Promise被
        // 当执行这个then时，说明传入逇Promise被resolve了，就可以完成Promise.resolve这个Promise的resolve了
        return value.then(resovle, reject);
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
    // 实现穿透效果 如果中间某个then没有传递成功的函数参数我们就给个默认函数：直接返回上一个then的返回值 就相当于一个中间商
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (err) => {
            throw err;
          };
    let promise2 = new Promise((resovle, reject) => {
      // console.log('promise2');
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
            // console.log(onRejected);
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
    // resolve方法返回一个新的Promise
    return new Promise((resolve, reject) => {
      // 这时这个val可能是Promise 在执行这个resolve时，要依据val看是否resolve
      resolve(val);
    });
  }
  static reject(reason) {
    // reject方法返回一个新的Promise
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  }
  static all(values) {
    // 这个返回的新的Promise的状态依据values中的每个值
    return new Promise((resolve, reject) => {
      let resultArr = [];
      let orderIndex = 0;

      function processResultByKey(value, index) {
        // 不使用push是为了按照顺序组织返回结果
        resultArr[index] = value;
        // 当最后一次执行的then方法执行 processResultByKey 方法时，说明所有Promise都已经完成
        if (++orderIndex === values.length) {
          resolve(resultArr);
        }
      }

      for (let i = 0; i < values.length; i++) {
        let value = values[i];
        if (value && typeof value.then === "function") {
          // 判断是否是Promise
          value.then((value) => {
            // then方法成功的回调被执行，说明这个Promise resolve了
            processResultByKey(value, i);
          }, reject); // 如果then方法的失败回调被执行了，立即终止Promise.all的这个Promise并执行reject
        } else {
          processResultByKey(value, i);
        }
      }
      
    });
  }
}
Promise.prototype.finally = function (callback) {
  // this => 调用finally方法的Promise
  // this.then => 是为了拿到调用finally方法的Promise的reslove/reject的值，传递下去
  return this.then(
    (value) => {
      // 将调用finally的Promise的reslove的value值返回 传入到finally后的then中
      return Promise.resolve(callback()).then(() => value);
    },
    (err) => {
      return Promise.resolve(callback()).then(() => {
        throw err;
      });
    }
  );
};

Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};

module.exports = Promise;
