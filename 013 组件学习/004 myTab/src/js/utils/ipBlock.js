/**
 * @author Jiawei Tang
 * @email  davidtangjw.pptv.com
 * @create date 2017-09-01 09:50:12
 * @modify date 2017-09-01 09:50:12
 * @desc 地域屏蔽工具类
 */

var cityCodeApi = require('../api/cityCodeApi');

var blockStrateges = {
    white: function(whiteList, cityCode) {
        var i = 0;
        while(i < whiteList.length) {
            if (whiteList[i++] === cityCode)
                return false;
        }
        return true;
    }
}

module.exports = function(cityCodeList,redirectUrl, blockStratege) {
    
    cityCodeList = cityCodeList || [];

    var stratege = blockStrateges[blockStratege];
    if (!stratege) {
        return;
    }

    cityCodeApi()
    .then(function(data){
        if (stratege(cityCodeList, parseInt(data))) {
            location.href = redirectUrl;
        }
    })

    
}

