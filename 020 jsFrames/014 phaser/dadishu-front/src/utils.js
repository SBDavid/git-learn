export default {
    parseQuery: (url) => {
        var queryObj={};
        var reg=/[?&]([^=&#]+)=([^&#]*)/g;
        var querys=url.match(reg);
        if(querys){
            for(var i in querys){
                var query=querys[i].split('=');
                var key=query[0].substr(1),
                    value=query[1];
                queryObj[key]?queryObj[key]=[].concat(queryObj[key],value):queryObj[key]=value;
            }
        }
        return queryObj;
    }
}