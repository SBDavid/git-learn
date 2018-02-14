window.onload = function() {

    var showImg = document.getElementById("showImg");

    var fileInput = document.getElementById('imgInput');

    fileInput.addEventListener('change', function(event) {
        console.info(fileInput.files)
    })


}