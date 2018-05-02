var currentComputedField;

function initReact(obj, key, val) {
	console.info('initReact', obj, key, val)

	const t = Object.prototype.toString.apply(obj[key]);
	var key = key;
	var watcher = [];

	let property = Object.getOwnPropertyDescriptor(obj, key);

	Object.defineProperty(obj, key, {
		get: function () {
			if (currentComputedField && watcher.indexOf(String(currentComputedField)) === -1) {
				watcher.push(String(currentComputedField));
			}
			console.info('get', key, watcher);
			return property.getter ? property.getter.call(obj) : val;
		},
		set: function (newVal) {
			console.info('set', newVal);
			property.setter ? property.setter.call(obj, newVal) : val = newVal;
		}
	});

	if (t === "[object Object]") {
		observe(obj[key]);
	}
}

function observe(obj) {
	console.info('observe', obj)
	for (var key in obj) {
		if (key === '__webviewId__') {
			continue;
		}
		initReact(obj, key, obj[key]);
	}
}

const computed = function (page) {
	const oldOnload = page.onLoad || function () { };
	const computed = page.computed || {};
	let oldSetData;

	page.onLoad = function () {
		console.info('computed onload', this);

		// crateReactive
		observe(this.data);

		oldSetData = this.setData.bind(this);

		// 设置computed初始值
		for (let key in computed) {
			currentComputedField = key;
			oldSetData({
				[key]: this.computed[key].apply(this)
			})
		}

		currentComputedField = false;

		// 重新设置setData
		this.setData = (data, callback) => {
			console.info('new setData')
			// 调用原始的setData
			oldSetData(data, callback);
			// 重新计算computed值
			/* for (let key in computed) {
				oldSetData({
					[key]: this.computed[key].apply(this)
				})
			} */
		}

		oldOnload.apply(this);
	}

	return page;
}

module.exports = computed;