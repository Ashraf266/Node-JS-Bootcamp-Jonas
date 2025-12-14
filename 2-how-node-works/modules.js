//we are in a function
// console.log(arguments);

// shows how node wraps each module in a function
// console.log(require("module").wrapper);

// export a class
// const Calculator = require("./test-module-1");
// const calc = new Calculator();
// console.log(Calculator);
// console.log(calc.__proto__.hasOwnProperty("add"));
// const proto = Object.getPrototypeOf(calc);
// console.log(Object.getOwnPropertyNames(proto));
// console.log(calc.add(2, 5));

// export multiple functions
// const calc2 = require("./test-module-2");
// console.log(calc2);
// console.log(calc2.add(2, 5));
// const { add, subtract, multiply, devide } = require("./test-module-2");
// console.log(add(2, 5));

// caching
const t1 = require("./test-module-3");
const t2 = require("./test-module-3");
console.log(t1 === t2);
require("./test-module-3")();
require("./test-module-3")();