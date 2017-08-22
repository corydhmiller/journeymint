var Event = function(sender) {
  this.sender = sender;
  this.listeners = [];
};
Event.prototype = {
  attach: function() {
    window.console.log(arguments);
      for (var i in arguments) {
        this.listeners.push(arguments[i]); 
      }
  },
  notify: function(args) {
    for (var i = 0; i < this.listeners.length; i += 1) {
      this.listeners[i](this.sender, args);
    }
  }
};