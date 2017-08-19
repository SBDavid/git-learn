window.onload = function() {
    var accessKey1 = document.getElementById('accessKey');
    accessKey1.accessKey = "w";
    console.info('accessKey1.accessKey: ', accessKey1.accessKey);

    document.getElementById('contentEditable').contentEditable = true;

    console.info('dataset', document.getElementById('dataset').dataset);

    var offset =  document.getElementById('offset');

    console.info('offsetHeight', offset.offsetHeight);
    console.info('offsetWidth', offset.offsetWidth);
    console.info('offsetTop', offset.offsetTop);
    console.info('offsetLeft', offset.offsetLeft);
    console.info('offsetParent', offset.offsetParent);

    document.getElementById('oncopy').oncopy = function(e) {
         e.clipboardData.setData("text", "test")
        console.info('oncopy: ', e.clipboardData.getData("text"));
    }
}