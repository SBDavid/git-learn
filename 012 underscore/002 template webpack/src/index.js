import MyList from './Mylist';

var list = new MyList.mylist();

window.onload = function() {
    list.mount(document.getElementById('con'),
    {
        data: [
            {name: 'tang'},
            {name: 'jia'},
            {name: 'wei'}
        ]
    });
}