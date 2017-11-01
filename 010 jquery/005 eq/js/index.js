window.onload = function() {
    console.log('$(\'div\')', $('div'));
    console.log('$(\'div\').eq(1)', $('div').eq(1));
    // jquery查询返回的array中就是浏览器中dom的引用
    console.dir($('div')[1] === document.getElementById('d2'));
    //
    $('#d2').click(function() {});
}