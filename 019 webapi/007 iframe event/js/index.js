

document.onclick = function() {
    console.log('popup from inner iframe')
}

window.onload = function() {
    console.info('window onload')
    document.getElementsByTagName('iframe')[0].contentDocument.addEventListener('click', function() {
        console.info('click from popup 2')
    });
}

document.getElementsByTagName('iframe')[0].onload = function() {
    console.info('iframe onload')
    document.getElementsByTagName('iframe')[0].contentDocument.addEventListener('click', function() {
        console.info('click from popup 1')
    })
}
console.info(document.readyState)
document.onreadystatechange = function(e) {
    console.info(document.readyState, e)
}

document.addEventListener("DOMContentLoaded", function() {
    console.info('DOMContentLoaded')
}, false);