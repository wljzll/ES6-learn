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
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];
        const resovle = (value) => {
            if (this.status === 'PENDING') {
                this.status = ENUM.FULFILLED;
                this.value = value;
                this.onFulfilledCallbacks.forEach(fn => fn());
            }
        }
        const reject = (reason) => {
            if (this.status === 'PENDING') {
                this.status = ENUM.REJECTED;
                this.reason = reason;
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
        // 可能将resolve/reject放到异步队列执行 执行then方法时，resolve可能还未执行，status还是PENDING
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