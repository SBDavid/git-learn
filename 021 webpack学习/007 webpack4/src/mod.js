
import {square} from "./mod1";

import(
    /* webpackChunkName: "my-chunk-name" */
    /* webpackMode: "lazy" */
    './mod1'
).then(mod1 => {
    console.info(mod1.square(2));
})


export default "mod111";

