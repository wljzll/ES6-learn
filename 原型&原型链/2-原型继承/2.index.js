function A (x) {
    this.x = x;
}
A.prototype.getX = function () {
    console.log(this.x);
}

function B (y) {
    this.y = y;
}

// 把B的原型指向A的实例
B.prototype = new A(200)

// 给原型上添加constructor属性
B.prototype.constructor = B;

// 往B的改写过的原型上添加方法
B.prototype.getY = function() {
  console.log(this.y);
}

const b = new B(300)

console.dir(b);