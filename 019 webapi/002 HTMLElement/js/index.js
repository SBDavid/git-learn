window.onload = function() {
    var accessKey1 = document.getElementById('accessKey');
    accessKey1.accessKey = "w";
    console.info('accessKey1.accessKey: ', accessKey1.accessKey);

    document.getElementById('contentEditable').contentEditable = true;
}