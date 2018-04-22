window.addEventListener('DOMContentLoaded', function() {

    var left = document.getElementsByClassName('left')[0];
    var right = document.getElementsByClassName('right')[0];
    var dragTarget = document.getElementById('dragTarget');

    document.addEventListener('dragstart', function(event) {
        if (event.target.classList.contains('dragTarget')) {
            dragTarget = event.target;
            console.info('dragstart', dragTarget);
            dragTarget.classList.add('drag-active');
        }
    });

    document.addEventListener('dragend', function(event) {
        
        dragTarget = event.target;
        console.info('dragend', dragTarget);
        dragTarget.classList.remove('drag-active')
    });

    document.addEventListener('drop', function(event) {
        if (event.target.classList.contains('dragTarget')) {
            console.info('drop', dragTarget);
            event.target.insertAdjacentElement('afterend', dragTarget);
        }
    });

    document.addEventListener('dragover', function(event) {
        if (event.target.classList.contains('dragTarget')) {
            event.preventDefault();
        }
    });

    document.addEventListener('dragenter', function() {
        if (event.target.classList.contains('left') || event.target.classList.contains('right')) {
            console.info('dragenter');
            event.target.classList.add('enter-right')
        }
    });

    document.addEventListener('dragleave', function() {
        if (event.target.classList.contains('left') || event.target.classList.contains('right')) {
            console.info('dragleave');
            event.target.classList.remove('enter-right');
        }
    });

    document.addEventListener('dragover', function( event ) {
        // 防止拖拉效果被重置，允许被拖拉的节点放入目标节点
        if (event.target.classList.contains('left') || event.target.classList.contains('right')) {
            event.preventDefault();
        }
    }, false);

    document.addEventListener('drop', function(event) {
        if (event.target.classList.contains('left') || event.target.classList.contains('right')) {
            console.info('drop');
            event.preventDefault();
            event.target.classList.remove('enter-right');
            event.target.appendChild(dragTarget);
        }
    });
})