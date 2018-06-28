/**
 * ...
 * @author minliang1112@foxmail.com | davidtangjw@pptv.com
 */

'use strict';

var fieldStringify = require('./fieldStringify');

var AnalyzeCommon = {

    getPageUrl: function () {
        return window.location.href.replace(/&/g, '%26').replace(/#/g, '%23');
    },

    getCookie: function (name, decode) {
        var value = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        return value ? (decode ? decodeURIComponent(value[2]) : value[2]) : null;
    },

    setCookie: function (name, value, expires) {
        var str = '';
        if (expires !== undefined && typeof expires == 'number') {
            var date = new Date();
            date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
            str = 'expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + escape(value) + '; ' + str + '; path=/; domain=pptv.com;';
    },

    generateVVID: function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxxxxxx4xxxyxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    },

    queryToObject: function (str) {
        if (!str || str == '') return {};
        var o = {}, list = str.split('&'), i = 0, item;
        while (list[i]) {
            item = list[i].split('=');
            o[item[0]] = item[1];
            i++;
        }
        return o;
    },

    objectToQuery: function (o) {
        var set = [];
        for (var i in o) {
            set.push(i + '=' + o[i]);
        }
        return set.join('&');
    },

    getQueryString: function (name, str) {
        if (str == undefined) {
            str = location.href;
        }
        //var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
        var reg = new RegExp("(^|\\?|&|#)" + name + "=([^&#]*)(&|#|$)", "i");
        if (reg.test(str)) return decodeURIComponent(RegExp.$2.replace(/\+/g, " "));
    },

    update_query_string: function( uri, key, value ) {
        
        // Use window URL if no query string is provided
        if ( ! uri ) { uri = window.location.href; }
    
        // Create a dummy element to parse the URI with
        var a = document.createElement( 'a' ), 
    
            // match the key, optional square bracktes, an equals sign or end of string, the optional value
            reg_ex = new RegExp( key + '((?:\\[[^\\]]*\\])?)(=|$)(.*)' ),
    
            // Setup some additional variables
            qs,
            qs_len,
            key_found = false;
    
        // Use the JS API to parse the URI 
        a.href = uri;
    
        // If the URI doesn't have a query string, add it and return
        if ( ! a.search ) {
    
            a.search = '?' + key + '=' + value;
    
            return a.href;
        }
    
        // Split the query string by ampersands
        qs = a.search.replace( /^\?/, '' ).split( /&(?:amp;)?/ );
        qs_len = qs.length; 
    
        // Loop through each query string part
        while ( qs_len > 0 ) {
    
            qs_len--;
    
            // Check if the current part matches our key
            if ( reg_ex.test( qs[qs_len] ) ) {
    
                // Replace the current value
                qs[qs_len] = qs[qs_len].replace( reg_ex, key + '$1' ) + '=' + value;
    
                key_found = true;
            }
        }   
    
        // If we haven't replaced any occurences above, add the new parameter and value
        if ( ! key_found ) { qs.push( key + '=' + value ); }
    
        // Set the new query string
        a.search = '?' + qs.join( '&' );
    
        return a.href;
    },

    isInt: function (s) {
        return /^\d+$/.test(s);
    },

    genpath: function (el) {
        function nodeatparentIx(el) {
            var tjId = el.getAttribute("tj_id");
            if (tjId && (!AnalyzeCommon.isInt(tjId))) {
                return tjId;
            }
            var p = el.parentNode, no = 0;
            for (var i = 0, len = p.childNodes.length; i < len; i++) {
                var node = p.childNodes[i];
                if (node.nodeType == 1 && node.tagName.toLocaleLowerCase() != 'script' && node.getAttribute("ignore") != 1) {
                    if (node == el) {
                        return no;
                    }
                    no++;
                }
            }
            return null;
        }

        var curr = el, path = [];
        while (curr) {
            if (curr.parentNode) {
                var n = nodeatparentIx(curr);
                path.push(n);
                if (!AnalyzeCommon.isInt(n)) {
                    break;
                }
            }
            curr = curr.parentNode;
        }
        path.reverse();
        return path.join(".");
    },
    addevent: function (el, eventName, callback) {
        if (el.addEventListener) {
            el.addEventListener(eventName, callback, false);
        } else if (el.attachEvent) {
            el.attachEvent('on' + eventName, callback);
        }
    },
    fieldStringify: fieldStringify
}

module.exports = AnalyzeCommon;