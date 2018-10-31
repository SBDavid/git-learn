import Circle from './Circle';

function canvasSupport() {
    return !!document.createElement('canvas').getContext;
}

export default class App {
	constructor(canvas, w, h) {
		// 画布
		this.ctx = null;
		this.canvas = canvas;
		// 获取屏幕尺寸
		this.windowH = h;
		this.windowW = w;
		// 移动对象
		this.circle = new Circle(this.windowW/2, this.windowH/2, 'steelblue', 20);
	
		// 初始化舞台
		this.canvas.width = this.windowW;
		this.canvas.height = this.windowH;
		this.ctx = this.canvas.getContext('2d');
		this.ctx.fillStyle = 'powderblue';
		this.ctx.fillRect(0, 0, this.windowW, this.windowH);
	
		this.canvas.addEventListener('touchmove', (event) => {
			event.preventDefault();
			this.onTouchMove(event, this.circle);
		})
		this.canvas.addEventListener('touchend', (event) => {
			this.onTouchEnd(event, this.circle);
		})
		// 开始游戏
		this.gameLoop(this.circle, this.ctx);
	}

	drawCircle(circle, ctx) {
		ctx.globalAlpha = 1;
		ctx.fillStyle = circle.color;
		ctx.beginPath();
		ctx.arc(circle.x, circle.y, circle.radius, 0, 2*Math.PI);
		ctx.fill();
	}
	
	drawCircles(circle, ctx) {
		for (let i=20; i>0; i--) {
			circle.radius = i;
			if (i%2 == 0) {
				circle.color = 'steelblue';
			} else {
				circle.color = 'skyblue';
			}
			this.drawCircle(circle, ctx);
		}
	}
	
	clearWorld(ctx) {
		ctx.fillStyle = 'powderblue';
		ctx.globalAlpha = 0.1;
		ctx.fillRect(0, 0, this.windowW, this.windowH);
	}
	
	drawWorld(circle, ctx) {
		this.clearWorld(ctx);
		this.drawCircles(circle, ctx);
	
		this.gameLoop(circle, ctx);
	}
	
	gameLoop(circle, ctx) {
		requestAnimationFrame(() => {
			this.drawWorld(circle, ctx)
		});
	}
	
	onTouchMove(event, circle) {
		const touch = event.targetTouches[0];
		circle.x = touch.clientX;
		circle.y = touch.clientY;
	}

	onTouchEnd() {
		postMessage(JSON.stringify({
			a: 'end'
		}))
	}
}
