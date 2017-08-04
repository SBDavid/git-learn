window.onload = function() {
    var canvas = document.getElementById('canvas');

    var ctx = canvas.getContext('2d');

    
    // 文字测量
    ctx.font = "24px serif";
    ctx.textBaseline = 'bottom';
    var text = ctx.measureText("Hello world");
    console.info(text);

    // 绘制圆形
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.arc(50, 200, 12, -Math.PI / 2, Math.PI / 2, true);
    ctx.fill();

    // 绘制矩形
    ctx.fillRect(50,188,132,24);

    // 绘制圆形
    ctx.beginPath();
    ctx.arc(182, 200, 12, Math.PI / 2, Math.PI * 1.5, true);
    ctx.fill();

    // 文字渲染
    ctx.fillText("Hello world", 50, 212);
}