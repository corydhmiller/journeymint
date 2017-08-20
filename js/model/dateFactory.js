var DateFactory = function () {
	this.time = new Date($.now());
    this.year = this.time.getFullYear();
    this.month = this.time.getMonth() + 1;
    this.date = this.time.getDate();
    if (this.month < 10) {
      this.month = "0" + this.month;
    }
};

DateFactory.prototype = {
	getInt: function() {
		return parseInt(this.year + this.month + this.date);
	}

};