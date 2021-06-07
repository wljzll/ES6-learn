let Promise = require("./promise");

Promise.all = function (values) {
  // 这个返回的新的Promise的状态依据values中的每个值
  return new Promise((resolve, reject) => {
    let resultArr = [];
    let orderIndex = 0;
    function processResultByKey(value, index) {
      // 不使用push是为了按照顺序组织返回结果
      resultArr[index] = value;
      // 当最后一次执行的then方法执行 processResultByKey 方法时，说明所有Promise都已经完成
      if(++orderIndex === values.length) {
        resolve(resultArr)
      }
    }
    for (let i = 0; i < values.length; i++) {
      let value = values[i];
      if (value && typeof value.then === 'function') {
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
};

let p1 = new Promise((reslove, reject) => {
  setTimeout(() => {
    reslove("p1");
  }, 1000);
});

let p2 = new Promise((reslove, reject) => {
  setTimeout(() => {
    reslove("p2");
  }, 1000);
});

Promise.all([1, 2, 3, p1, p2, 6]).then((data) => {
  console.log(data);
});
