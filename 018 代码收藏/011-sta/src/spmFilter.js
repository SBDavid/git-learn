// 只有符合条件的a标签才会添加spm参数
var filter = {
    rules: {
        def: function () {
            return function () {
                return false;
            }
        },
        isAnchor: function (args) {
            var tag = args.tag || 'A';
            return function (el) {
                if (!el) {
                    return false;
                }
                else if (el.nodeName.toLowerCase() === tag.toLowerCase())
                    return true;
                else
                    return false;
            }
        },
        isValidUrl: function () {
            return function (el) {
                if (!el.href)
                    return false;

                return /^(\w+:)*\/\/\w+/.test(el.href);
            }
        },
        isPlaylink: function() {
            // 播放串
            var patternPlayLink = /^(pptv|vod|live){1}:\/\/\w+/i;
            return function (el) {
                if (!el || !el.href)
                    return false;
                return patternPlayLink.test(el.href);
            }
        },
        isValidRootHost: function (args) {

            var vHost = args.vHost || 'pptv.com';
            // /^(?:\w+:)*\/\/(?:\w+\.)*(pptv.com\/|pptv.com$|pptv.com#|pptv.com\?)/
            var patternUrl = new RegExp("^(?:\\w+:)*//(?:\\w+\\.)*(" + vHost + "/|" + vHost + "$|" + vHost + "#|" + vHost + "\\?)")
            
            return function (el) {
                return patternUrl.test(el.href);
            }

        },
        isValidHost: function (args) {
            
            var vHosts = args.vHosts || ['www\.pptv\.com'];
            var patternUrls = [];

            for (var index in vHosts) {
                // /^(?:\w+:)*\/\/(?:\w+\.)*(pptv.com\/|pptv.com$|pptv.com#|pptv.com\?)/
                patternUrls.push(new RegExp("^(?:\\w+:)*//(" + vHosts[index] + "/|" + vHosts[index] + "$|" + vHosts[index] + "#|" + vHosts[index] + "\\?)"));
            }
            return function (el) {
                for (var index in patternUrls) {
                    if (patternUrls[index].test(el.href)) {
                        return true;
                    }
                }
                return false;
            }
        }
    },

    // 更具配置生成一个过滤器
    get: function (_rules) {
        var filters = [];

        for (var i = 0; i < _rules.length; i++) {
            (function (arg, self) {
                var tFilter = self.rules[_rules[arg].name](_rules[arg].args);
                filters.push(function (el) {
                    return tFilter(el);
                })
            })(i, this)
        }

        return function (el) {
            for (var i = 0; i < filters.length; i++) {
                if (!filters[i](el))
                    return false;
            }
            return true;
        }
    }
};

module.exports = filter;