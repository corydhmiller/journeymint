var Event = function(sender) {
  this.sender = sender;
  this.listeners = [];
};
Event.prototype = {
  attach: function(listener) {
      this.listeners.push(listener);
  },
  subscribe: function(listener) {
    for (var i in listener) {
      this.listeners.push(listener[i]); 
    }
  },
  notify: function(args) {
    for (var i = 0; i < this.listeners.length; i += 1) {
      this.listeners[i](this.sender, args);
    }
  }
};