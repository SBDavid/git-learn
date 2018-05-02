const computed = function(page) {
    const oldOnload = page.onLoad || function() {};
    const computed = page.computed || {};
    let oldSetData
    page.onLoad = function() {
        console.info('computed onload', this);
        oldSetData = this.setData.bind(this);

        // 设置computed初始值
        for(let key in computed) {
            oldSetData({
                [key]: this.computed[key].apply(this)
            })
        }
        // 重新设置setData
        this.setData = (data, callback) => {
            console.info('new setData')
            // 调用原始的setData
            oldSetData(data, callback);
            // 重新计算computed值
            for (let key in computed) {
                oldSetData({
                    [key]: this.computed[key].apply(this)
                })
            }
        }

        oldOnload.apply(this);
    }

    return page;
}

module.exports = computed;