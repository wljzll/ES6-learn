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
            if (this.status === 'PENDING') {
                this.status = ENUM.FULFILLED;
                this.value = value;
            }
        }
        const reject = (reason) => {
            if (this.status === 'PENDING') {
                this.status = ENUM.REJECTED;
                this.reason = reason;
            }
        }
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
    }
}
module.exports = Promise;