/* import data from './foo.js';
export default function () {
  console.log(data);
} */

function asyncImport() {
    console.info(111)
    import('./foo').then(({default: d}) => {
        console.info(222)
        console.info(d)
    });
}

export default asyncImport;