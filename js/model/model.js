// Let's prepare the Model
var mintModel = function() {
  // Set up variables
  this.accomplishmints = [];
  // These are dummy tags. Every global tag will be stored here in these tags. In the future, this list will be stored and retrieve just like the accomplishmints
  this.tags = [];
  this.datesInArchive = [];
  this.totalScore = 0;
  this.score = 0;
  this.messageZIndex = 1000;
  this.encouragements = [
    "Great job!",
    "Well done!",
    "You've done great things!",
    "Be proud of yourself!",
    "All right!",
    "Woo, don't stop now!",
    "You're on fire!",
    "Nothing can stop you now!",
    "That's impressive!",
    "Fantastic!",
    "You've got this!",
    "Amazing!",
    "So good!"
  ];

  // Set up the events
  this.addAccomplishmintEvent = new Event(this);
  this.deleteAccomplishmintEvent = new Event(this);
  this.saveEditedAccomplishmintEvent = new Event(this);
  this.retrieveAccomplishmintsFromStorageEvent = new Event(this);
  this.putAccomplishmintsIntoStorageEvent = new Event(this);
  this.updateItemTagsEvent = new Event(this);
  this.addItemTagEvent = new Event(this);
  this.deleteItemTagEvent = new Event(this);
  //this.updateTodaysScoreEvent = new Event(this);
  this.displayTagErrorEvent = new Event(this);

  // Set up the database
  this.database = new Database();
  this.DateFactory = new DateFactory();
};

mintModel.prototype = {
  getAccomplishmints: function() {
    // This function returns whatever accomplishmints are currently stored in the Model's data
    return this.accomplishmints;
  },
  getAccomplishmintScore: function(content) {
    // Run the content through this function to get the score. Right now it just is the length of the string, where one character is one point.
    var score = content.length;
    // Clean up the score
    score = isNaN(parseFloat(score)) ? 0 : parseFloat(score);
    return score;
  },
  getDateInt: function() {
    // Get today's date and return it in an integer, starting with the year
    // EG: 20170726
    return this.DateFactory.getInt();
  },
  sanitizeText: function(text) {
    // Make it so sneaky buggers can't add sneaky code in any of the inputs. Always run input entries through this function.
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  },
  addAccomplishmint: function(content) {
    // This is the main function that adds new accomplishmints into the Model's data
    if (!content || !content.replace(/\s/g, "").length) {
      // If input is empty, be done.
      return;
    }
    // Sanitize content
    content = this.sanitizeText(content);
    // Set Accomplishmint ID to "now"
    var id = $.now();
    // Get score using other function, and clean it up real nice
    var score = this.getAccomplishmintScore(content);
    // Set this date
    var date = this.getDateInt();
    // Push accomplishmint into the model's data array.
    var newAccomplishmint = {
      date: date,
      id: id,
      content: content,
      score: score,
      goal: "",
      tags: [],
      stars: 0,
      notes: ""
    };
    // Add this new accomplishmint to the Model data array
    this.accomplishmints.push(newAccomplishmint);
    // Run the function that submits the Model's data into the database/storage
    this.putAccomplishmintsIntoStorage();
    this.addAccomplishmintEvent.notify(newAccomplishmint);
    //this.updateTodaysScoreEvent.notify();
  },
  saveEditedAccomplishmint: function(id, newcontent) {
    id = parseInt(id);
    var accomplishmints = this.accomplishmints;
    // Find the matching accomplishmint ID and insert new content
    for (var item in accomplishmints) {
      if (accomplishmints[item].id === id) {
        accomplishmints[item].content = newcontent;
        accomplishmints[item].score = this.getAccomplishmintScore(newcontent);
      }
    }
    // Run the function that submits the Model's data into the database/storage
    this.putAccomplishmintsIntoStorage();
    this.saveEditedAccomplishmintEvent.notify({
      id: id,
      newcontent: newcontent
    });
    //this.updateTodaysScoreEvent.notify();
  },
  deleteAccomplishmint: function(id) {
    // This function handles the deletion of
    var accomplishmints = this.accomplishmints.sort();
    // Convert ID from string into integer
    id = parseInt(id);
    // Search the array for the matching ID. When it is found, remove it from the array
    for (var i = accomplishmints.length - 1; i >= 0; i--) {
      if (accomplishmints[i].id === id) {
        accomplishmints.splice(i, 1);
      }
    }
    this.putAccomplishmintsIntoStorage();
    //this.updateTodaysScoreEvent.notify();
    this.deleteAccomplishmintEvent.notify({
      id: id
    });
  },
  checkThroughArrayForNumber: function(value, array) {
    // This function takes a value and looks through an array to see if the array contains that value
    return array.indexOf(value) > -1;
  },
  addNewTagToItem: function(id, tagname) {
    // Parse into integer so it can match up with the object.
    id = parseInt(id);
    // Get data from self
    var mastertags = this.tags;
    var accomplishmints = this.accomplishmints;
    // Okay, here's where it gets really complex.
    // Loop through the master tags and see if there's already
    // a tag with that name. If there is, we don't
    // need to create a new master tag.
    for (var a in mastertags) {
      // For every master tag, search the tagcontent of that tag.
      // If there's a match, technically we should just do nothing.
      if (mastertags[a].tagname === tagname) {
        // If there is a master tag that matches the tag the user is
        // trying to add, continue.
        var tagid = mastertags[a].tagid;
        // Search through the accomplishmints to find the item itself
        for (var i in accomplishmints){          
          if(accomplishmints[i].id === id) {
            if(this.checkThroughArrayForNumber(tagid, accomplishmints[i].tags)){
              // If this item already has this tag,
              // close out the function and spit out an error at some point?
              // Maybe clear the tag input?
              this.displayTagErrorEvent.notify({
                id: id,
                tagid: tagid
              });
              return;
            } else {
              // If the item does not have the tag, push the tag id
              // into the item's data
              accomplishmints[i].tags.push(tagid);
              this.putAccomplishmintsIntoStorage();
              this.addItemTagEvent.notify({
                id: id,
                tagid: tagid,
                tagname: tagname
              });
              return;
            }
          }
        }
      }
    }
    // At this point in this function, no tags currently exist with that name,
    // which also means the item does not have the tag or tag id.
    
    // First we need to create the tag, but we need to make sure the tagid
    // does not yet exist.
    // Let's set up a new variable at 1.
    var newTagID = 1;
    for (var m in mastertags) {
      if (mastertags[m].tagid === newTagID) {
        // If there's already a tag id there, add one to the newTagID variable.
        // It'll keep trying until it finds a free spot.
        newTagID++;
      }
    }
    // Now that the variable is at an available integer, we can go ahead
    // and add the new tag to our master tag data.
    mastertags.push({
      tagid: newTagID,
      tagname: tagname
    });
    // Now we also need to store the new tag id into the matching
    // item's tag array.
    for (var j in accomplishmints){
      if (accomplishmints[j].id === id) {
        // When we find the matching item, push the newTagID into the tags
        accomplishmints[j].tags.push(newTagID);
      }
    }
    // Now save all the master tags to the database.
    this.database.set({
      storageItem: mastertags,
      storageUnit: "accomplishmintsAppStorage--tags"
    });
    // Oh yeah, save the accomplishmints as well, because there are new tags in play.
    this.putAccomplishmintsIntoStorage();
    // Notify everyone! Whew, that was crazy!
    this.addItemTagEvent.notify({
      id: id,
      tagid: newTagID,
      tagname: tagname
    });
    return;
  },
  deleteItemTag:function(args){
    for (var item in this.accomplishmints) {
      if(this.accomplishmints[item].id === args.id) {
        var index = this.accomplishmints[item].tags.indexOf(args.tagid);
        if (index > -1) {
            this.accomplishmints[item].tags.splice(index, 1);
        }
      }
    }
    this.putAccomplishmintsIntoStorage();
    this.deleteItemTagEvent.notify({
      id: args.id,
      tagid: args.tagid
    });
  },
  updateNoteContent: function(id, noteContent){
    id = parseInt(id);
    noteContent = this.sanitizeText(noteContent);
    for (var item in this.accomplishmints){
      if(this.accomplishmints[item].id === id) {
        this.accomplishmints[item].notes = noteContent;
      }
    }
    this.putAccomplishmintsIntoStorage();
  },
  updateStarLevel: function(id, starValue) {
    starValue = parseInt(starValue);
    id = parseInt(id);
    for (var item in this.accomplishmints){
      if(this.accomplishmints[item].id === id) {
        this.accomplishmints[item].stars = starValue;
      }
    }
    this.putAccomplishmintsIntoStorage();
  },
  putAccomplishmintsIntoStorage: function() {
    // Dump the main accomplishmints array into a stringy and store it.
    // Right now it's just local storage, but eventually it'll be a database.
    this.database.set({
      storageItem: this.accomplishmints,
      storageUnit: "accomplishmintsAppStorage"
    });
    this.putAccomplishmintsIntoStorageEvent.notify();
    return;
  },
  retrieveAccomplishmintsFromStorage: function() {
    // Get the items from storage and parse them with JSON.
    var storedAccomplishmints = this.database.get({
      storageUnit: "accomplishmintsAppStorage"
    });
    if (storedAccomplishmints === null || storedAccomplishmints === "") {
    } else {
      // Update the model's data to reflect what is in storage.
      this.accomplishmints = storedAccomplishmints;
    }
    this.updateDatesInArchive();
    this.retrieveAccomplishmintsFromStorageEvent.notify();
    return;
  },
  updateDatesInArchive: function() {
    // Load in variables
    var accomplishmints = this.accomplishmints;
    // Reset the dates in archive to zero.
    this.datesInArchive = [];
    // Go through all the accomplishmints and pull the date variables and throw them into an array.
    for (var item in accomplishmints) {
      var found = jQuery.inArray(accomplishmints[item].date, this.datesInArchive);
      if (found >= 0) {
        // do nothing
      } else {
        this.datesInArchive.push(accomplishmints[item].date);
      }
    }
  },
  retrieveTagsFromStorage: function() {
    // Get the items from storage and parse them with JSON.
    var storedTags = this.database.get({
      storageUnit: "accomplishmintsAppStorage--tags"
    });

    if (storedTags === null || storedTags === "") {

    } else {
      // Update the model's data to reflect what is in storage.
      this.tags = storedTags;
    }
    return;
  }
};