window.onload = function () {
    var FILE = 'http://a.com/019%20webapi/013%20mse/test.webm';
    var NUM_CHUNKS = 5;
    var video = document.querySelector('video');

    window.MediaSource = window.MediaSource || window.WebKitMediaSource;

    var mediaSource = new MediaSource();
    setTimeout(function(){
        video.src = window.URL.createObjectURL(mediaSource);
    }, 3000)
    //video.src = window.URL.createObjectURL(mediaSource);

    function callback(e) {
        var sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');


        GET(FILE, function (uInt8Array) {
            var file = new Blob([uInt8Array], { type: 'video/webm' });
            var chunkSize = Math.ceil(file.size / NUM_CHUNKS);

            var i = 0;

            (function readChunk_(i) {
                var reader = new FileReader();

                // Reads aren't guaranteed to finish in the same order they're started in,
                // so we need to read + append the next chunk after the previous reader
                // is done (onload is fired).
                reader.onload = function (e) {
                    sourceBuffer.appendBuffer(new Uint8Array(e.target.result));
                    if (i == NUM_CHUNKS - 1) {
                        mediaSource.endOfStream();
                    } else {
                        if (video.paused) {
                            video.play(); // Start playing after 1st chunk is appended.
                        }
                        readChunk_(++i);
                    }
                };

                var startByte = chunkSize * i;
                var chunk = file.slice(startByte, startByte + chunkSize);

                reader.readAsArrayBuffer(chunk);
            })(i);  // Start the recursive call by self calling.
        });
    }

    mediaSource.addEventListener('sourceopen', callback, false);
    mediaSource.addEventListener('webkitsourceopen', callback, false);

    mediaSource.addEventListener('webkitsourceended', function (e) {
    }, false);

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