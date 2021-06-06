// 基础版的基础上解决异步resolve/reject的问题

/**
 * 1、同一个promise实例可以then多次(发布订阅模式)
 * 2、调用then时 当前的状态如果是等待状态，需要将成功和失败的回调 分别进行
 *    存放(订阅)
 * 3、调用resolve/reject时，将订阅的函数进行执行(发布的过程)
 */

const ENUM = {
    PENDING: 'PENDING',
    FULFILLED: 'FULFILLED',
    REJECTED: 'REJECTED'
}

class Promise {
    constructor(executor) {
        this.status = ENUM.PENDING;
        this.value = null;
        this.reason = null;
        // 存放then中成功的函数参数
        this.onFulfilledCallbacks = [];
        // 存放then中失败的函数参数
        this.onRejectedCallbacks = [];
        const resovle = (value) => {
            if (this.status === 'PENDING') {
                this.status = ENUM.FULFILLED;
                this.value = value;
                // resolve执行完后 再去执行then中成功的函数参数
                this.onFulfilledCallbacks.forEach(fn => fn());
            }
        }
        const reject = (reason) => {
            if (this.status === 'PENDING') {
                this.status = ENUM.REJECTED;
                this.reason = reason;
                // reject执行完后 再去执行then中失败的函数参数
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        }
        // executor执行可能出错
        try {
            executor(resovle, reject);
        } catch (error) {
            reject(error)
        }

    }
    then(onFulfilled, onRejected) {
        if (this.status === ENUM.FULFILLED) {
            onFulfilled(this.value);
        }
        if (this.status === ENUM.REJECTED) {
            onRejected(this.reason);
        }
        // 可能将resolve/reject放到异步队列执行 执行then方法时，resolve/reject可能还未执行，status还是PENDING
        // 所以当执行then时，status是PENDING，肯定是将resolve/reject放到了异步队列中，此时收集成功/失败的函数
        // 参数
        if(this.status === ENUM.PENDING) {
            this.onFulfilledCallbacks.push(() => {
                onFulfilled(this.value);
            })
            this.onRejectedCallbacks.push(() => {
                onRejected(this.value);
            })
        }
    }
}
module.exports = Promise;