window.onload = function() {
    var canvas = document.getElementById('canvas');

    var ctx = canvas.getContext('2d');

    // 文字渲染
    ctx.font = "24px serif";
    ctx.fillText("Helloworld", 0, 100);
    // 文字测量
    var text = ctx.measureText("Helloworld唐");
    console.info(text);

    // 绘制圆形
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.arc(50, 200, 30, 0, Math.PI * 2, true);
    ctx.fill();
}