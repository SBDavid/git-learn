$.ajax({
    url: "http://webuser.api.pptv.com/follow/multiFollower", 
    data: {
        usernames:'',
        token:''
    },
    dataType: 'jsonp',
    jsonp: 'cb',
    jsonpCallback: 'callback50',
    success: function (data) {
        console.info('sueccess: ', data);
    },
    error: function (data) {
        console.info('error: ', data);
    }
});