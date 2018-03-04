export const Utils = {
    drawUpArrow: function({ctx, baseCo, size}) { 
        const length = Math.floor(size * 0.3);
        ctx.fillStyle = "green";
        ctx.lineWidth = 1;
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(baseCo.x, baseCo.y-length);
        ctx.lineTo(baseCo.x-length, baseCo.y+length);
        ctx.lineTo(baseCo.x+length, baseCo.y+length);
        ctx.fill();
    },
    drawRightArrow: function({ctx, baseCo, size}) { 
        const length = Math.floor(size * 0.3);
        ctx.fillStyle = "green";
        ctx.lineWidth = 1;
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(baseCo.x+length, baseCo.y);
        ctx.lineTo(baseCo.x-length, baseCo.y-length);
        ctx.lineTo(baseCo.x-length, baseCo.y+length);
        ctx.fill();
    },
    drawBottomArrow: function({ctx, baseCo, size}) { 
        const length = Math.floor(size * 0.3);
        ctx.fillStyle = "green";
        ctx.lineWidth = 1;
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(baseCo.x, baseCo.y+length);
        ctx.lineTo(baseCo.x-length, baseCo.y-length);
        ctx.lineTo(baseCo.x+length, baseCo.y-length);
        ctx.fill();
    },
    drawLeftArrow: function({ctx, baseCo, size}) { 
        const length = Math.floor(size * 0.3);
        ctx.fillStyle = "green";
        ctx.lineWidth = 1;
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(baseCo.x-length, baseCo.y);
        ctx.lineTo(baseCo.x+length, baseCo.y-length);
        ctx.lineTo(baseCo.x+length, baseCo.y+length);
        ctx.fill();
    }
}