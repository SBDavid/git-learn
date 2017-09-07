window.onload = function() {
    document.getElementById('a1').onclick = function (e) {
        e.preventDefault();
        console.info(e);
    }
}