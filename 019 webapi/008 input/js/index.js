window.onload = function() {
    var input = document.getElementById('i');
    var getValue = document.getElementById('getValue');
    var setValue = document.getElementById('setValue');
    var setAttribute = document.getElementById('setAttribute');

    getValue.onclick = function() {
        console.info('input.value', input.value);
    }

    setValue.onclick = function() {
        input.value = 'default';
    }

    setAttribute.onclick = function() {
        input.setAttribute('value', 'setAttribute');
    }
}