import MyList from './Mylist';

var list = new MyList.mylist();
var list1 = new MyList.mylist();

window.onload = function () {
    list.mount(document.getElementById('con'),
    {
        data: [
            { name: 'tang' },
            { name: 'jia' },
            { name: 'wei' }
        ]
    });

    list1.mount(document.getElementById('con1'),
    {
        data: [
            { name: 'tang' }
        ]
    });
}