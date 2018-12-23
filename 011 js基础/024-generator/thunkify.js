function thunkify(fn) {
    return function() {
      var args = new Array(arguments.length);
      var ctx = this;
  
      for (var i = 0; i < args.length; ++i) {
        args[i] = arguments[i];
      }
  
      return function (done) {
        var called;
  
        args.push(function () {
          if (called) return;
          called = true;
          done.apply(null, arguments);
        });
  
        try {
          fn.apply(ctx, args);
        } catch (err) {
          done(err);
        }
      }
    }
  };

  function test(a, c) {
      c(a);
  }

  function add (a, b) {
      console.info('add')
      return a+b
  }

  thunkify(add(1,1))