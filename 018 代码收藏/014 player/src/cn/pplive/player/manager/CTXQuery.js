/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import Global from './Global';
import { H5CommonUtils } from "common/H5CommonUtils";

export default class CTXQuery {

    static ctx = { };

    static setCTX(value) {
        let ctx = {},
            reg = /{[p|d|a|v|s]+}/g,  //透传方向  p—play; d—dac; a—ads; v—vod; s-show;(节目集合)
            val = H5CommonUtils.queryToObject(value);
        for (let i in val) {
            let tempStr;
            if (typeof val[i] == 'string') tempStr = val[i];
            if (typeof val[i] == 'object' && val[i].length != undefined) tempStr = val[i][val[i].length - 1];
            if (tempStr.search(reg) != -1) {
                let temp = tempStr.match(reg).toString().replace('{', '').replace('}', '').split('|');
                for (let j = 0; j < temp.length; j++) {
                    if (ctx[temp[j]] == undefined) ctx[temp[j]] = { };
                    ctx[temp[j]][i] = tempStr.replace(reg, '');
                }
            } else {
                if (ctx['c'] == undefined) ctx['c'] = { };
                ctx['c'][i] = tempStr;
            }
            CTXQuery.ctx = ctx;
            Global.debug('ctx字段中包含 ' + i + ' 字段，value值 ： ' + val[i] + ' ......');
        }
    }

    static getCTX(obj, type) {
        let query = '';
        if (obj[type]) {
            for (let i in obj[type]) {
                if (i != 'isVip') {
                    query += ((query != '')?'&':'') + i + '=' + obj[type][i];
                    //当vip登录时 type后加vip
                    /* if (i == 'type' && VIPPrivilege.isVip && obj[type][i].indexOf('vip') == -1) {
                        query += '.vip';
                    } */
                }
            }
        }
        return query;
    }

    /**
     * 指定play ctx
     */
    static get pctx() { return CTXQuery.getCTX(CTXQuery.ctx, 'p'); }
    /**
     * 指定dac ctx
     */
    static get dctx() { return CTXQuery.getCTX(CTXQuery.ctx, 'd'); }
    /**
     * 指定adv ctx
     */
    static get actx() { return CTXQuery.getCTX(CTXQuery.ctx, 'a'); }
    /**
     * 指定video ctx
     */
    static get vctx() { return CTXQuery.getCTX(CTXQuery.ctx, 'v'); }

    static get sctx() { return CTXQuery.getCTX(CTXQuery.ctx, 's'); }
    /**
     * 默认 ctx
     */
    static get cctx() { return CTXQuery.getCTX(CTXQuery.ctx, 'c'); }

    static contain(key) {
        return Boolean(CTXQuery.getAttr(key));
    }
    
    static getAttr(key) {
        for (let i in CTXQuery.ctx) {
            for (let j in CTXQuery.ctx[i]) {
                if (j == key) return CTXQuery.ctx[i][j];
            }
        }
        return null;
    }
    
    static setAttr(key, value) {
        if (CTXQuery.ctx['c'] == undefined) CTXQuery.ctx['c'] = { };
        CTXQuery.ctx['c'][key] = value;
    }

}