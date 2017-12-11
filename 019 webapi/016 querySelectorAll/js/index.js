window.onload = function() {

    // jquery 返回的事副本
    /* var box = $('#jquery');
    var move = $('#jquery').find('.move');

    $('#jquery').find('.move').remove();

    console.info(move);
    box.append(move); */

    // jquery事件代理后，把类名修改
    /* $('#j').on('click', '.move', function(e) {
        console.info(e.target.innerHTML, e.target);
    });
    // 结果删除类名后，事件不响应
    $('.move').removeClass('move'); */

    // getElementById 返回引用
    /* var box = document.getElementById('g');
    var move = box.children;
    console.info('move', move);
    box.removeChild(move[0]);
    box.removeChild(move[0]);
    // 删除后move实时变化
    console.info(move);
    box.append(move); */

    // querySelectotAll
    var q = document.querySelector('#q');
    var qmove = document.querySelectorAll('#q .move');
    console.info(qmove);
    q.removeChild(qmove[0]);
    q.removeChild(qmove[1]);
    console.info(qmove);
    q.appendChild(qmove[0]);
}