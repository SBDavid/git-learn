const Koa = require('koa');
const app = new Koa();
var ReactDOMServer = require('react-dom/server');

var element = require('./temp/dist/demo');
// x-response-time

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

// logger

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

// response

app.use(async ctx => {
    ctx.body = ReactDOMServer.renderToString(element);
});

app.listen(80);