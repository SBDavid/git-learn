var df = $.Deferred();

df.progress(function(res){
    console.info('progress', res);
});

df.then(function(){
    console.info('then');
});

df.always(function() {
    console.info('always');
});

df.done(function() {
    console.info('done');
});

df.resolve('resolve');
df.notifyWith('test', ['msg']);
