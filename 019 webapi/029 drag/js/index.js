window.addEventListener('DOMContentLoaded', function() {

    var left = document.getElementsByClassName('left')[0];
    var right = document.getElementsByClassName('right')[0];
    var dragTarget = document.getElementById('dragTarget');

    dragTarget.addEventListener('dragstart', function() {
        console.info('dragstart', this);
        this.classList.add('drag-active')
    });

    dragTarget.addEventListener('dragend', function() {
        console.info('dragend');
        this.classList.remove('drag-active')
    });

    right.addEventListener('dragenter', function() {
        console.info('dragenter');
        this.classList.add('enter-right')
    });

    right.addEventListener('dragleave', function() {
        console.info('dragleave');
        this.classList.remove('enter-right')
    })
})