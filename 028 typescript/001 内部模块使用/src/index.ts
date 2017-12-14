
import {Greeter as G1} from "./module1";
import {Greeter as G2} from "./module2";

let g1 = new G1("world");
console.info(g1.greet());

let g2 = new G2("world");
console.info(g2.greet());

