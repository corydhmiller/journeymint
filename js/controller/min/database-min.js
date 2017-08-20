// Here's the database service
var Database = function(data) {
  this.data = data;
};
Database.prototype = {
  set: function(data) {
    // This takes whatever is passed into data.storageItem, stringifies it, and
    // puts it into the localStorage. Simple.
    var stringThis = JSON.stringify(data.storageItem);
    window.localStorage.setItem(data.storageUnit, stringThis);
  },
  get: function(data) {
    // This returns the data so that other functions can set variables based on the
    // data retrieved.
    return JSON.parse(window.localStorage.getItem(data.storageUnit));
  }
};

