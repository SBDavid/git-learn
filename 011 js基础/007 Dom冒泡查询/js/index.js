window.onload = function() {
    var root = document.getElementById('root');
    root.addEventListener("click",function(e) {
        console.info('e: ', e);

        var list = Array.prototype.slice.call(root.children, 0, 2);
        console.info('list: ', list);

        var target = e.target;

        console.info('孩子的下标：', list.indexOf(target));
    })
}