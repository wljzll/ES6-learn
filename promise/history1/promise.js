// 基础版
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
        const resovle = (value) => {
            if (this.status === 'PENDING') { // 防止重复执行
                this.status = ENUM.FULFILLED;
                // 将resolve传入的值保存到实例上
                this.value = value;
            }
        }
        const reject = (reason) => {
            if (this.status === 'PENDING') { // 防止重复执行
                this.status = ENUM.REJECTED;
                // 将resolve传入的值保存到实例上
                this.reason = reason;
            }
        }
        try {
            // 创建实例时 立即执行executor
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
    }
}
module.exports = Promise;