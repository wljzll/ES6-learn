function A (x) {
    this.x = x;
}
A.prototype.getX = function () {
    console.log(this.x);
}

function B (y) {
    this.y = y;
}
B.prototype.getY = function () {
    console.log(this.y);
}

// 情况一、
let b1 = new B(100);
b1.y;
b1.getY();
b1.getX(); // Uncaught TypeError: b1.getX is not a function