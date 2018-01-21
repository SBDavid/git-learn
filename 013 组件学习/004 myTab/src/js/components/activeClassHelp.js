module.exports = function(data) {
    if (data === true)
        return 'class="play-list-item active"';
    else
        return 'class="play-list-item"';
}