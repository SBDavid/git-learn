window.onload = function () {
    var FILE = 'http://a.com/019%20webapi/013%20mse/test.webm';
    var NUM_CHUNKS = 5;
    var video = document.querySelector('video');

    window.MediaSource = window.MediaSource || window.WebKitMediaSource;

    var mediaSource = new MediaSource();
    video.src = window.URL.createObjectURL(mediaSource);

    function callback(e) {
        var sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');

        logger.log('mediaSource readyState: ' + this.readyState);

        GET(FILE, function(uInt8Array) {

            
        });
    }

    function GET(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.send();

        xhr.onload = function (e) {
            if (xhr.status != 200) {
                alert("Unexpected status code " + xhr.status + " for " + url);
                return false;
            }
            callback(new Uint8Array(xhr.response));
        };
    }
}