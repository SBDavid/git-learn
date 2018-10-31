var particle = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    mass: 1,
    radius: 0,
    bounce: -1,
    friction: 1,
    gravity: 0,
    springs: null,
    gravitations: null,

    create: function(x, y, speed, direction, grav) {
        var obj = Object.create(this);
        obj.x = x;
        obj.y = y;
        obj.vx = Math.cos(direction) * speed;
        obj.vy = Math.sin(direction) * speed;
        obj.gravity = grav || -0.1;
        obj.springs = [];
        obj.gravitations = [];
        return obj;
    },

    addGravitation: function(p) {
        this.removeGravitation(p);
        this.gravitations.push(p);
    },

    removeGravitation: function(p) {
        for (var i = 0; i < this.gravitations.length; i += 1) {
            if (p === this.gravitations[i]) {
                this.gravitations.splice(i, 1);
                return;
            }
        }
    },

    addSpring: function(point, k, length) {
        this.removeSpring(point);
        this.springs.push({
            point: point,
            k: k,
            length: length || 0
        });
    },

    removeSpring: function(point) {
        for (var i = 0; i < this.springs.length; i += 1) {
            if (point === this.springs[i].point) {
                this.springs.splice(i, 1);
                return;
            }
        }
    },

    getSpeed: function() {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    },

    setSpeed: function(speed) {
        var heading = this.getHeading();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
    },

    getHeading: function() {
        return Math.atan2(this.vy, this.vx);
    },

    setHeading: function(heading) {
        var speed = this.getSpeed();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
    },

    accelerate: function(ax, ay) {
        this.vx += ax;
        this.vy += ay;
    },

    update: function() {
        this.handleSprings();
        this.handleGravitations();
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;



    },

    handleGravitations: function() {
        for (var i = 0; i < this.gravitations.length; i += 1) {
            this.gravitateTo(this.gravitations[i]);
        }
    },

    handleSprings: function() {
        for (var i = 0; i < this.springs.length; i += 1) {
            var spring = this.springs[i];
            this.springTo(spring.point, spring.k, spring.length);
        }
    },

    angleTo: function(p2) {
        return Math.atan2(p2.y - this.y, p2.x - this.x);
    },

    distanceTo: function(p2) {
        var dx = p2.x - this.x,
            dy = p2.y - this.y;

        return Math.sqrt(dx * dx + dy * dy);
    },

    gravitateTo: function(p2) {
        var dx = p2.x - this.x,
            dy = p2.y - this.y,
            distSQ = dx * dx + dy * dy,
            dist = Math.sqrt(distSQ),
            force = p2.mass / distSQ,
            ax = dx / dist * force,
            ay = dy / dist * force;

        this.vx += ax;
        this.vy += ay;
    },

    springTo: function(point, k, length) {
        var dx = point.x - this.x,
            dy = point.y - this.y,
            distance = Math.sqrt(dx * dx + dy * dy),
            springForce = (distance - length || 0) * k;
        this.vx += dx / distance * springForce,
            this.vy += dy / distance * springForce;
    }
};

var utils = {
    norm: function(value, min, max) {
        return (value - min) / (max - min);
    },

    lerp: function(norm, min, max) {
        return (max - min) * norm + min;
    },

    map: function(value, sourceMin, sourceMax, destMin, destMax) {
        return utils.lerp(utils.norm(value, sourceMin, sourceMax), destMin, destMax);
    },

    clamp: function(value, min, max) {
        return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
    },

    distance: function(p0, p1) {
        var dx = p1.x - p0.x,
            dy = p1.y - p0.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    distanceXY: function(x0, y0, x1, y1) {
        var dx = x1 - x0,
            dy = y1 - y0;
        return Math.sqrt(dx * dx + dy * dy);
    },

    circleCollision: function(c0, c1) {
        return utils.distance(c0, c1) <= c0.radius + c1.radius;
    },

    circlePointCollision: function(x, y, circle) {
        return utils.distanceXY(x, y, circle.x, circle.y) < circle.radius;
    },

    pointInRect: function(x, y, rect) {
        return utils.inRange(x, rect.x, rect.x + rect.width) &&
            utils.inRange(y, rect.y, rect.y + rect.height);
    },

    inRange: function(value, min, max) {
        return value >= Math.min(min, max) && value <= Math.max(min, max);
    },

    rangeIntersect: function(min0, max0, min1, max1) {
        return Math.max(min0, max0) >= Math.min(min1, max1) &&
            Math.min(min0, max0) <= Math.max(min1, max1);
    },

    rectIntersect: function(r0, r1) {
        return utils.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) &&
            utils.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height);
    },

    degreesToRads: function(degrees) {
        return degrees / 180 * Math.PI;
    },

    radsToDegrees: function(radians) {
        return radians * 180 / Math.PI;
    },

    randomRange: function(min, max) {
        return min + Math.random() * (max - min);
    },

    randomInt: function(min, max) {
        return Math.floor(min + Math.random() * (max - min + 1));
    }

};

var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

var width = canvas.width = 400;
var height = canvas.height = 300;



var ball1 = particle.create(50, 0, 0, 1, .5);
ball1.radius = 30;
ball1.mass = 1;
var ball2 = particle.create(150, 40, 0, 1, .5);
ball2.radius = 30;
ball2.mass = 1;
var ball3 = particle.create(250, 80, 0, 1, .5);
ball3.radius = 30;
ball3.mass = 1;

var ball4 = particle.create(350, 120, 0, 1, .5);
ball4.radius = 30;
ball4.mass = 1;


function update() {
    context.clearRect(0, 0, width, height);

    ball1.update();
    draw(ball1, "#4285F4");

    ball2.update();
    draw(ball2, "#34A853");

    ball3.update();
    draw(ball3, "#FBBC05");


    ball4.update();
    draw(ball4, "#EA4335");



    requestAnimationFrame(update);
}




function draw(p, color) {

    context.save();
    context.translate(p.x, p.y);
    context.rotate(p.getHeading() + utils.degreesToRads(90));
    context.lineWidth = 2;



    if (p.getSpeed() / 9 > 1) {
        context.scale(1, p.getSpeed() / 9);
    }



    p.vx *= 0.99;
    p.vy *= 0.99;

    context.fillStyle = color;
    context.beginPath();
    context.arc(0, 0, p.radius, 0, Math.PI * 2, false);
    context.fill();
    context.fillStyle = color;

    context.fillRect(-1, 0, 2, -p.getSpeed() - 10);


    if (p.y + p.radius > height - 50) {
        p.y = height - p.radius - 50;

        p.setHeading(p.getHeading() * -1)
        p.setSpeed(1);

        p.setSpeed(15);




    }
    if (p.x + p.radius > width || p.x - p.radius < 0) {
        p.vx *= -1;
    }
    context.restore();




}
export default {
    update
}