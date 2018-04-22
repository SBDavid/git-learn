window.onload = function() {
    // 获取图片
    let img = document.getElementsByTagName('img')[0];

    // 转为canvas
    var canvas = document.getElementsByTagName('canvas')[0];
    var ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // ImageData
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);



    var newImageData = ctx.createImageData(canvas.width,canvas.height);

    // 改变透明度
    imageData.data.forEach(function(val, idx) {
        if (idx % 4 === 3) {
            newImageData.data[idx] = 100;
        } else {
            newImageData.data[idx] = val;
        }
    });

    ctx.putImageData(newImageData, 0, 0);
}