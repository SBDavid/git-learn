module.exports = async function logger(ctx, next) {
    const startDate = new Date();
    for (var index = 0; index < 1000000; index++) {
        var element = index

    }
    next();
    console.log(`method: ${ctx.method} code: ${ctx.status} time:${new Date() - startDate}ms`);
}
