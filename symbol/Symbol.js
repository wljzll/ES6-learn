// ES6中新加入的原始数据类型（基本数据类型/值类型），代表唯一值
/**
 * 用途：
 * 1、对象的唯一属性：防止同名属性，及被改写或者覆盖
 * 2、消除魔术字符串：指代码中多次出现，强耦合的字符串或数值，应避免，而使用含义清晰的变量代替
 */


/**
 * 基本语法：
 * 1、Symbol()和Symbol([key])
 * 
 * 2、Symbol不能被new，虽然它确实是构造函数
 * 
 * 3、Symbol.prototype 与 Object(Symbol)
 * 
 * 4、Symbol不能与其他类型的值计算
 *    1) 数学计算：不能转换为数字，显示转换也不可以
 *    2) 字符串拼接：隐式转换不可以，显示转换可以
 *    3) 模板字符串：不支持
 * 
 * 5、Symbol属性不参与for......in/of遍历
 */

// 语法1
// let n = Symbol(),
// m = Symbol();
// console.log(n ,m);
// console.log(n === m); // false
// let n = Symbol('A'),
// m = Symbol('A');
// console.log(n ,m);
// console.log(n === m); // false

// 语法2
// new Symbol; //VM41:1 Uncaught TypeError: Symbol is not a constructor

// 语法3
// Symbol() instanceof Symbol;  // false

// 语法4
// let n = Symbol();
// n + 10; // Cannot convert a Symbol value to a number
// n + 'zf'; // Cannot convert a Symbol value to a string
// `${n}` // Cannot convert a Symbol value to a string
// Number(Symbol()); // Cannot convert a Symbol value to a number
// console.log(String(Symbol('A'))); // Symbol(A)
// console.log(String(Symbol('A')) === String(Symbol('A'))); // true

// 语法5
// let obj = {
//     name: 'zf',
//     age: 10,
//     [Symbol('100')]: 100,
//     [Symbol('200')]: 200
// }
// // name age
// for (const key in obj) {
//     console.log(key)
// }

// console.log(Object.getOwnPropertyNames(obj)); // [ 'name', 'age' ]

// console.log(JSON.stringify(obj)); // {"name":"zf","age":10}

// console.log(Object.getOwnPropertySymbols(obj)); // [ Symbol(100), Symbol(200) ]

/**
 * ES6提供很多内置的Symbol值，指向语言内部使用的方法
 * 
 * 1、Symbol.hasInstance：对象的Symbol.hasInstance属性，指向一个内部方法，当其他对象使用instance运算符
 * ，判断是否为该对象的实例时，会调用这个方法。(Function类有这个方法，内置的Object、Array会沿着原型链找到Function)
 * 
 * 2、Symbol.isConcatSpreadable：值为布尔值，表示该对象用于Array.prototype.concat()时，是否可以展开
 * 
 * 3、Symbol.iterator：拥有此属性的对象被誉为可迭代的对象，可以使用for......of循环
 *    数组、类数组、map、set、NodeList有这个属性，Object没有
 * 
 * 4、Symbol.toPrimitive：该对象被转为原始数据类型的值时，会调用这个方法，返回该对象对应的原始数据类型的值
 * 
 * 5、Symbol.
 * .prototype.toString()方法时，如果这个方法存在，它的返回值会出现在toString
 * 方法返回的字符串之中，表示这个对象的类型
 */

// // Symbol.hasInstance

// class Person {};
// let p1 = new Person;
// console.log(p1 instanceof Person); // true
// console.log(Person[Symbol.hasInstance](p1)); // true
// console.log(Object[Symbol.hasInstance]({})); // true

// Symbol.isConcatSpreadable

// let arr = [4, 5, 6];
// console.log(arr[Symbol.isConcatSpreadable]); // undefined
// let res = [1,2,3].concat(arr);
// console.log(res); // [ 1, 2, 3, 4, 5, 6 ]
// arr[Symbol.isConcatSpreadable] = false;
// res = [1,2,3].concat(arr);
// console.log(res); // [ 1, 2, 3, [ 4, 5, 6, [Symbol(Symbol.isConcatSpreadable)]: false ] ]

// Symbol.iterator
// let obj = {
//     name: 'zf',
//     age: 10,
//     length:2
// }
// for (const iterator of obj) {
//     console.log(iterator); // TypeError: obj is not iterable
// }

// 手动变为可迭代，要先把obj的结构改成数组形式的键值对，Object形式的键值对遍历结果是undefined
// let obj = {
//     0: 'zf',
//     1: 10,
//     length: 2,
//     [Symbol.iterator]: Array.prototype[Symbol.iterator]
// }
// for (const iterator of obj) {
//     console.log(iterator); // TypeError: obj is not iterable
// }

// Symbol.toPrimitive
/**
 * 对象数据类型进行转换：
 * 1、首先，调用obj[Symbol.toPrimitive](hint)，前提是这个方法存在
 * 2、如果方法不存在并且hint是"string"， —— 尝试调用obj.toString()和obj.valueOf()
 * 3、如果方法不存在并且hint是"number"或者"default" —— 尝试调用obj.valueOf和obj.toString()
 */
let a = {
    value: 0,
    valueOf() {
        return ++this.value
    }
}
// let a = {
//     value: 0,
//     [Symbol.toPrimitive](hint) {
//         console.log(hint);
//         switch (hint) {
//             case 'number':
                
//                 return ++this.value;
//                 break;
//             case 'string':
//                 return String(this.value);
//                 break;
//             default:
//                 return ++this.value;
//                 break;
//         }
//     }
// }
// if (a == 1 && a == 2 && a == 3) { // == 会发生隐式转换，会将a转换成number
//     console.log('OK!');
// }

// Object.toStringTag

class Person {
    get[Symbol.toStringTag]() {
        return 'Person'
    }
}
let p1 = new Person;
// console.log(({}).toString.call(p1)); // "[object Person]"
// console.log(p1.toString()); // "[object Person]"