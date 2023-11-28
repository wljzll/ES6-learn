/**
 * 原型：
 * 1、所有的函数数据类型都自带一个属性：prototype（原型），这个属性就是原型，它是一个对象;
 * 2、在浏览器给 prototype 开辟的堆内存中有一个天生自带的属性：constructor，这个属性存储
 *    的值是当前函数本身；
 * 3、每一个对象都有一个 __proto__的属性，这个属性指向当前实例所属类的 prototype(原型)，
 *   （如果不能确定它是谁的实例，都是Object的实例;）
 */

class A  {
  constructor(){
     this.name = 'zf'
     this.age = 12
  }
}

A.prototype.test = function () {
  console.log(this, '这是原型上的test方法');
}



const a = new A

console.dir(A)

