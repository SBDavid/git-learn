define(['require'], function (require) { 'use strict';

  /* import data from './foo.js';
  export default function () {
    console.log(data);
  } */

  function asyncImport() {
      console.info(111);
      new Promise(function (resolve, reject) { require(['./chunk-4eabdebb.js'], resolve, reject) }).then(({default: d}) => {
          console.info(222);
          console.info(d);
      });
  }

  return asyncImport;

});
