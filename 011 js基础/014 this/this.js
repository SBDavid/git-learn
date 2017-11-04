var a = [1];


a.forEach(function(){
    console.info(this);
})

a.forEach(item => {
    console.info(this);
})

/* var bob = {
    _name: "Bob",
    _friends: ['aaa','bbb','ccc'],
    printFriends() {
      this._friends.forEach(f =>
        console.log(this._name + " knows " + f));
    }
  };
  
  //调用
  bob.printFriends(); */