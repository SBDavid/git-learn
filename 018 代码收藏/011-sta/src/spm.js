
var AnalyzeCommon = require("./AnalyzeCommon"),
    filter = require("./spmFilter");

var spm = function() {
    this.spmTag = document.body.getAttribute('data-spm-pagename');
    this.anchorFilter = filter.get([
        {
            name: 'isAnchor',
            args: {
            }
        }, {
            name: 'isValidUrl',
            args: {
            }
        }, {
            name: 'isValidHost',
            args: {
                vHosts: [
                    'www\.pptv\.com',
                    'v\.pptv\.com'/* , 
                    'sports\.pptv\.com',
                    'tv\.pptv\.com',
                    'movie\.pptv\.com',
                    'zongyi\.pptv\.com',
                    'cartoon\.pptv\.com',
                    'top\.pptv\.com',
                    'list\.pptv\.com',
                    'search\.pptv\.com',
                    'zt\.pptv\.com' */
                ]
            }
        }]);
    this.playlink = filter.get([
        {
            name: 'isPlaylink',
            args: {
            }
        }]);
}

spm.prototype.install = function() {
    var self = this;
    // 如果没有安装spm标签则当前页面不统计
    if (!this.spmTag) 
        return;
    AnalyzeCommon.addevent(document, 'mousedown', function(el) {
        self.appendSpmParam(el);
    });

    AnalyzeCommon.addevent(document, 'touchend', function(el) {
        self.appendSpmParam(el);
    });
}

spm.prototype.genSpm = function(el) {
    return this.spmTag + '.' + AnalyzeCommon.genpath(el);
}

spm.prototype.appendSpmParam = function(ev) {
    ev = ev || window.event;
    var target = ev.target || ev.srcElement;

    while(target !== null && target.nodeName.toLowerCase() !== 'a') {
        target = target.parentElement;
    }

    if (!this.anchorFilter(target) && !this.playlink(target)) {
        return false;
    }

    var spmParam = this.genSpm(target);

    target.href = AnalyzeCommon.update_query_string(target.href, 'spm', spmParam);
    if (target.getAttribute('_href')) {
        target.setAttribute('_href', AnalyzeCommon.update_query_string(target.getAttribute('_href'), 'spm', spmParam))
    }
}

module.exports = spm;