var myInput = require("./modules/myInput/index");

var tab = require("./modules/tab/index");

var myInputA = new myInput();
myInputA.init("这个组件被单独使用，请输入名称", "名称", "张三丰", '你好');

var tabModel = new tab();

var nameInput = new myInput();
nameInput.init("在tab中嵌套使用，请输入品名", "品名", '洗衣液', '品名为');
var priceInput = new myInput();
priceInput.init("在tab中嵌套使用，请输入价格", "价格", '100', '价格为');
var amountInput = new myInput();
amountInput.init("在tab中嵌套使用，请输入数量", "数量", '10', '数量为');

window.onload = function() {
    // 单独使用一个组件
    document.getElementById('root').appendChild(myInputA.getView().$el[0]);

    tabModel.init();
    tabModel.add("品名", nameInput, true);
    tabModel.add("价格", priceInput, false);
    tabModel.add("数量", amountInput, false);
    document.getElementById('tabs').appendChild(tabModel.getView().$el[0]);
}