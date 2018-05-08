import {str, str2} from "./primitiveValue";

console.info("导出String", str, str2);

import {test, test2} from "./classValue";

new test();

new test2();

import {fun, fun2} from "./functionValue";

console.info("导出function", fun(), fun2());

import {obj, obj2} from "./objectValue";

console.info("导出Object", obj, obj2)