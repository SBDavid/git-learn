Array.prototype.myForeach = function(callback, context) {
    var context = context || window;
    for(var i = 0; i< this.length; i++) {
        callback && callback.call(context, this[i], i, this);
    }
}



[1, 2, 3].myForeach(function(item){
    console.info(item);
})