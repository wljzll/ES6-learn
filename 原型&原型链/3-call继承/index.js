function A (x) {
    this.x = x;
}
A.prototype.getX = function () {
    console.log(this.x);
}

function B (y) {
    // 执行A函数 把x页绑定B的私有属性上
    A.call(this, 200)
    this.y = y;
}

B.prototype.getY = function() {
  console.log(this.y);
}

const b = new B(100)

console.log(b);
