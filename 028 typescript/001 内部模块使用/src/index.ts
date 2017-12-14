
import {Greeter as G1} from "./module1";
import {Greeter as G2} from "./module2";

let g1 = new G1("world");
console.info(g1.greet());

let g2 = new G2("world");
console.info(g2.greet());

// 导入Boolean
import {testVal} from "./module3";
console.info('导入Boolean', testVal);

// 导出接口，方法
import {testInterface, funa} from "./module3";

funa({label: "label"});

