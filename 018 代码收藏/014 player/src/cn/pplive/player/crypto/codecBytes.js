/** @fileOverview Bit array codec implementations.
 *
 * @author Emily Stark
 * @author Mike Hamburg
 * @author Dan Boneh
 */

/**
 * Arrays of bytes
 * @namespace
 */

'use strict';

import {bitArray} from "./bitArray";

export const bytes = { 
    /** Convert from a bitArray to an array of bytes. */
    fromBits (arr) {
      var out = [], bl = bitArray.bitLength(arr), i, tmp;
      for (i=0; i<bl/8; i++) {
        if ((i&3) === 0) {
          tmp = arr[i/4];
        }
        out.push(tmp >>> 24);
        tmp <<= 8;
      }
      while(out.length>0){
        	if(out[out.length-1] == 0){
        		out.pop();
        	}else break;
      }
      return out;
    },
    /** Convert from an array of bytes to a bitArray. */
    toBits (bytes) {
      var out = [], i, tmp=0;
      for (i=0; i<bytes.length; i++) {
        tmp = tmp << 8 | bytes[i];
        if ((i&3) === 3) {
          out.push(tmp);
          tmp = 0;
        }
      }
      if (i&3) {
        out.push(bitArray.partial(8*(i&3), tmp));
      }
      return out;
    }
}