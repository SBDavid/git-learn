var assert = require('assert');
var filter = require('../src/spmFilter');

describe('spm链接过滤器测试', function () {

    var anchorFilter = filter.get([
        {
            name: 'isAnchor',
            args: {

            }
        }, {
            name: 'isValidUrl',
            args: {
                vHost: 'pptv\.com'
            }
        }, {
            name: 'isValidRootHost',
            args: {

            }
        }]);
    
    var playlink = filter.get([
        {
            name: 'isPlaylink',
            args: {

            }
        }]);

    describe('不是a标签', function () {
        
        var target = {
            nodeName: 'span'
        };

        it('应该返回false', function () {
            assert.equal(false, anchorFilter(target));
        });
    });

    describe('a标签没有href属性', function () {

        var target = {
            nodeName: 'a'
        };

        it('应该返回false', function () {
            assert.equal(false, anchorFilter(target));
        });
    });

    describe('href是空', function () {
        
        var target = {
            nodeName: 'a',
            href: null
        };

        it('应该返回false', function () {
            assert.equal(false, anchorFilter(target));
        });
    });

    describe('href=#', function () {
        
        var target = {
            nodeName: 'a',
            href: '#'
        };

        it('应该返回false', function () {
            assert.equal(false, anchorFilter(target));
        });
    });

    describe('href=javescript(0)', function () {
        
        var target = {
            nodeName: 'a',
            href: 'javescript(0)'
        };

        it('应该返回false', function () {
            assert.equal(false, anchorFilter(target));
        });
    });

    describe('href非pptv.com域名', function () {
        
        var target = {
            nodeName: 'a',
            href: '//qq.com'
        };

        it('应该返回false', function () {
            assert.equal(false, anchorFilter(target));
        });
    });

    describe('href=mailto:test@pptv.com', function () {
        
        var target = {
            nodeName: 'a',
            href: 'mailto:test@pptv.com'
        };

        it('应该返回false', function () {
            assert.equal(false, anchorFilter(target));
        });
    });

    describe('pptv根域名', function () {
        
        var target = {
            nodeName: 'a',
            href: 'http://pptv.com?p=1'
        };

        it('应该返回true', function () {
            assert.equal(true, anchorFilter(target));
        });
    });

    describe('pptv二级域名', function () {
        
        var target = {
            nodeName: 'a',
            href: 'http://www.pptv.com?p=1#part1'
        };

        it('应该返回true', function () {
            assert.equal(true, anchorFilter(target));
        });
    });

    describe('相对路径', function () {
        
        var target = {
            nodeName: 'a',
            href: '//www.pptv.com?p=1#part1'
        };

        it('应该返回true', function () {
            assert.equal(true, anchorFilter(target));
        });
    });

    describe('pptv协议', function () {
        
        var target = {
            nodeName: 'a',
            href: 'pptv://sdfsafasd334343'
        };

        it('应该返回true', function () {
            assert.equal(true, playlink(target));
        });
    });

    describe('二级域名验证www.pptv.com', function () {
        
        var target = {
            nodeName: 'a',
            href: 'http://www.pptv.com'
        };

        it('应该返回true', function () {
            assert.equal(true, isValidHost(target));
        });
    });


    var isValidHost = filter.get([
        {
            name: 'isValidHost',
            args: {
                vHosts: ['www\.pptv\.com', 'eee\.pptv\.com']
            }
        }]);
    describe('二级域名验证eee.pptv.com', function () {
        
        var target = {
            nodeName: 'a',
            href: 'http://eee.pptv.com'
        };

        it('应该返回true', function () {
            assert.equal(true, isValidHost(target));
        });
    });
});