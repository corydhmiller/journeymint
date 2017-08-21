var mintView = function(model) {
  this.model = model;
  this.addAccomplishmintEvent = new Event(this);
  this.deleteAccomplishmintEvent = new Event(this);
  this.saveEditedAccomplishmintEvent = new Event(this);
  this.deleteItemTagClickEvent = new Event(this);
  this.updateStarLevelEvent = new Event(this);
  this.keyWasPressedEvent = new Event(this);

  this.init();
};

mintView.prototype = {
  init: function() {
    this.createChildren()
    .setupHandlers()
    .enable();
  },

  createChildren: function() {
    this.$appContainer = $(".app-container");
    this.$appHeader = $(".app-header");
    this.$appBody = $(".app-body");
    this.$input = $(".accomplishmint__input");
    this.$accomplishmintsList = $(".accomplishmints-list");
    this.$accomplishmintContainer = $(".accomplishmint-container");
    this.$messageContainer = $(".message-container");
    this.$scoreTally = $(".app-score__tally");
    this.$advancedContainer = $(".item__advanced");
    this.$itemContainer = this.$accomplishmintsList.find(".item-container");
    this.$itemTagInput = this.$accomplishmintsList.find(".item__tag__input");

    return this;
  },
  setupHandlers: function() {
    this.addAccomplishmintHandler = this.addAccomplishmint.bind(this);
    this.deleteAccomplishmintHandler = this.deleteAccomplishmint.bind(this);
    this.removeAccomplishmintFromViewHandler = this.removeAccomplishmintFromView.bind(this);
    this.editAccomplishmintHandler = this.editAccomplishmint.bind(this);
    this.saveEditedAccomplishmintHandler = this.saveEditedAccomplishmint.bind(this);
    this.buildListHandler = this.buildList.bind(this);
    this.displayNewEncouragementHandler = this.displayNewEncouragement.bind(this);
    this.rebuildItemCardHandler = this.rebuildItemCard.bind(this);
    this.updateStarLevelHandler = this.updateStarLevel.bind(this);
    this.updateTodaysScoreHandler = this.updateTodaysScore.bind(this);
    this.addItemTagHandler = this.addItemTag.bind(this);
    this.deleteItemTagHandler = this.deleteItemTag.bind(this);
    this.deleteItemTagClickHandler = this.deleteItemTagClick.bind(this);
    this.displayTagErrorHandler = this.displayTagError.bind(this);
    this.keyActionsHandler = this.keyActions.bind(this);
    this.cacheDOMHandler = this.cacheDOM.bind(this);
    return this;
  },

  enable: function() {
    // Listeners
    this.model.retrieveAccomplishmintsFromStorageEvent.attach(this.buildListHandler);
    this.model.addAccomplishmintEvent.subscribe([
      this.displayNewEncouragementHandler,
      this.addAccomplishmintHandler,
      this.updateTodaysScoreHandler,
      this.cacheDOMHandler
    ]);
    this.model.deleteAccomplishmintEvent.subscribe([
      this.removeAccomplishmintFromViewHandler,
      this.updateTodaysScoreHandler,
      this.cacheDOMHandler
    ]);
    this.model.saveEditedAccomplishmintEvent.subscribe([
      this.rebuildItemCardHandler,
      this.updateTodaysScoreHandler,
      this.cacheDOMHandler
    ]);
    //this.model.updateTodaysScoreEvent.attach(this.updateTodaysScoreHandler);
    this.model.addItemTagEvent.attach(this.addItemTagHandler);
    this.model.deleteItemTagEvent.attach(this.deleteItemTagHandler);
    this.model.displayTagErrorEvent.attach(this.displayTagErrorHandler);

    // Manage actions
    this.$input.keydown(this.keyActionsHandler);
    this.$accomplishmintsList.on("keydown", ".editable-accomplishmint", this.keyActionsHandler);
    this.$accomplishmintsList.on("keydown", this.$itemTagInput, this.keyActionsHandler);
    this.$accomplishmintsList.on("click", ".accomplishmint-delete", this.deleteAccomplishmintHandler);
    this.$accomplishmintsList.on("click", ".accomplishmint-edit", this.editAccomplishmintHandler);
    this.$accomplishmintsList.on("click", ".accomplishmint-save", this.saveEditedAccomplishmintHandler);
    this.$accomplishmintsList.on("click", ".accomplishmint__item-content--editable", this.editAccomplishmintHandler);
    this.$accomplishmintsList.on("click", ".item__tag .item__close", this.deleteItemTagClickHandler);
    this.$accomplishmintsList.on("click", ".item__stars label", this.updateStarLevelHandler);

    return this;
  },
  cacheDOM:function() {
    this.createChildren();
  },
  keyActions: function(event) {
    this.keyWasPressedEvent.notify({
      event: event
    });
  },
  getParentItemContainerID:function(event){
    return $(event.target).parents(".item-container").attr("id");
  },
  updateTodaysScore: function() {
    // Updates the main score in the view.
    var accomplishmints = this.model.accomplishmints;
    var modelScore = 0;
    for (var item in accomplishmints){
      modelScore = modelScore + accomplishmints[item].score;
    }
    this.$scoreTally.text(modelScore);
  },
  addAccomplishmint: function(sender, args) {
    this.$accomplishmintsList.prepend(
      this.generateItemHTML(args.id, args.content)
    );
    // Clear the primary input
    this.clearAccomplishmintInput();
  },
  deleteAccomplishmint: function(event) {
    this.deleteAccomplishmintEvent.notify({id: this.getParentItemContainerID(event)});
  },
  removeAccomplishmintFromView: function(sender, args) {
    // Completely remove this item from the view.
    // Like, all the way remove.
    $("#" + args.id).remove();
  },
  addClassForATime:function(event, toggle, time) {
    event.removeClass(toggle);
    event.addClass(toggle);
    setTimeout(function(){
      event.removeClass(toggle);
    }, time);
  },
  displayTagError:function(sender, args) {
    this.addClassForATime($("#advanced-" + args.id).find(".item__tag__input"), "input--error", 1000);
    this.addClassForATime($("#advanced-" + args.id).find(".item__tag__input"), "shake", 1000);
    this.addClassForATime($("#advanced-" + args.id).find("[data-tagid='" + args.tagid + "']"), "shake", 1000);
  },
  editAccomplishmint: function(event) {
    // Get id from Edit Button
    var id = this.getParentItemContainerID(event);
    var mainContainer = $("#" + id).find(".accomplishmint-container");
    var advancedMenu = $("#advanced-" + id);
    // Make the main container look like you can edit it.
    mainContainer.addClass("accomplishmint-container--editable");
    // Remove the class that makes this content editable.
    //This prevents clicking on this element and having the data be removed. Like a chump.
    mainContainer
      .find(".accomplishmint__item-content")
      .removeClass("accomplishmint__item-content--editable");
    var editableContent = $(
      "#" + id + " .accomplishmint__item .accomplishmint__item-content"
    );
    var content = editableContent.text();
    editableContent.html(
      '<input class="editable-accomplishmint" id="edit-' +
      id +
      '" data-id="' +
      id +
      '"/>'
    );
    $("#edit-" + id).val(content).focus();
    advancedMenu.addClass("item__advanced--open");
    this.changeEditButtonToSaveButton(id);
  },
  changeEditButtonToSaveButton: function(id) {
    // This just changes the element from Edit to Save, and because of the class,
    // they behave differently.
    // Not really sure if this should be a toggle event or not.
    var editButton = $("#" + id + " .accomplishmint-menu .accomplishmint-edit");
    editButton
      .removeClass("accomplishmint-edit")
      .addClass("accomplishmint-save")
      .text("Save");
  },
  saveEditedAccomplishmint: function(event) {
    this.saveEditedAccomplishmintEvent.notify({
      event: event
    });
  },
  convertDateIntToString: function(int) {
    var from_date = int.toString();
    var d = new Date(
      parseInt(from_date.substring(0, 4), 10),
      parseInt(from_date.substring(4, 6), 10) - 1,
      parseInt(from_date.substring(6), 10)
    );
    var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

    return monthNames[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  },
  checkIfTodaysDateIsInArchive: function() {
    var todaysDate = this.model.getDateInt();
    var dates = this.model.datesInArchive;
    for (var date in dates) {
      var found = jQuery.inArray(dates[date].date, todaysDate);
      if(found) {
        return true;
      }
    }
    return false;
  },
  buildList: function() {
    // This function is generally only called on initial load, or
    // if the
    // Get the data from the model and set some variables
    var accomplishmints = this.model.getAccomplishmints();
    // Clear the HTML in the view
    this.$accomplishmintsList.html("");   
    // Now let's add the items in each section
    for (var item in accomplishmints) {
      this.$accomplishmintsList.prepend(
         this.generateItemHTML(
           accomplishmints[item].id, accomplishmints[item].content
         )
       );

    }
    this.clearAccomplishmintInput();
    this.updateTodaysScore();
    this.cacheDOM();
  },
  assignRandomColorClass:function() {
    var randomColors = ['item__tag--green', 'item__tag--lightgreen', 'item__tag--darkgreen'];
    return randomColors[
      Math.floor(Math.random() * randomColors.length)
    ];
  },
  fetchTagsFromItem: function(id) {
    // Grab all the items from the model.
    var accomplishmints = this.model.accomplishmints;
    // Just in case the id sent was a string, parse it into an integer.
    id = parseInt(id);
    // Search for the matching accomplishmint and pull out the tag id numbers
    for (var i = 0, len = accomplishmints.length; i < len; i++) {
      if (accomplishmints[i].id === id) {
        return accomplishmints[i].tags;
      }
    }
  },
  deleteItemTag: function(sender, args){
    $("#advanced-" + args.id).find("[data-tagid='" + args.tagid + "']").remove();
  },
  deleteItemTagClick:function(event) {
    this.deleteItemTagClickEvent.notify($(event.target).parent().data());
  },
  addItemTag: function(sender, args) {
    $("#"+ args.id).find(".item__tags-list").append(this.generateSingleTagHTML(args.id, args.tagid, args.tagname));
    $("#"+ args.id).find(".item__tag__input").val('');
  },
  generateSingleTagHTML: function(id, tagid, tagname){
    var html = '<span class="item__tag ' + this.assignRandomColorClass() + '" data-tagid="' + tagid + '" data-id="' + id + '">' + tagname + ' <span class="item__close">x</span></span>';
    return html;
  },
  generateTagHTML: function(id) {
    // Get the tags from the object.
    var tags = this.fetchTagsFromItem(id);
    // We'll call these master tags to differentiate from item tags.
    var mastertags = this.model.tags;
    var html = "";
    for (var r in tags) {
      // Search through all of the tags that the item has.
      for (var mastertag in mastertags) {
        // Also search through all the tags in the master tag object.
        if (mastertags[mastertag].tagid === tags[r]) {
          // If there's a match, create the tag HTML here
          html =
            html + this.generateSingleTagHTML(id, mastertags[mastertag].tagid, mastertags[mastertag].tagname);
        }
      }
    }
    // Return all the tag HTML
    return (
      '<div class="item__tags"><small>Add some tags related to your accomplishmint:</small><br><div class="item__tags-list">' +
      html +
      '</div><input class="item__tag__input" data-id="' +
      id +
      '"/></div>'
    );
  },
  // These elements are split up into different functions in case
  // they need to be replaced or updated individually.
  generateItemCardHTML: function(id, content) {
    return (
      '<div data-id="' + id +
      '" class="card accomplishmint-container"><div class="accomplishmint__item"><span data-id="' +
      id +
      '" class="accomplishmint__item-content accomplishmint__item-content--editable">' +
      content +
      '</span></div><div class="accomplishmint-menu"><button data-id="' +
      id +
      '" class="accomplishmint-edit accomplishmint__button">Edit</button><button data-id="' +
      id +
      '" class="accomplishmint-delete accomplishmint__button">X</button></div></div>'
    );
  },
  generateItemStarsHTML: function(id) {
    // This is MESSY. I hate it SO MUCH.
    // It works, but I hate it.
    var html = '<div class="item__stars"><small>How did this accomplishmint make you feel?</small><br> <fieldset>';
    var accomplishmints = this.model.accomplishmints;
     for (var item in accomplishmints) {
       for (var i = 1; i <= 4; i++) {
         var initialStarValue = 1;
         if(accomplishmints[item].id === id) {
           var starValue = accomplishmints[item].stars;
        html = html + '<input type=\"radio\" id=\"'+ id +'-star'+i+'\" name=\"'+ id +'-star\" value=\"'+i+'\"';
           if (starValue === i){
             initialStarValue++;
             html = html + "checked";
           }
        html = html + '><label for=\"'+ id +'-star'+i+'\">'+i+' stars</label>';
        }
      }
    }
    html = html + '</fieldset></div>';
    // I hate it. So much.
    return html;
  },
  
  updateStarLevel: function(event) {
    var star = event.target.htmlFor;
    var id = $(event.target).parents(".item-container").attr("id");
    var starValue = $("#"+star).val();
    this.updateStarLevelEvent.notify({
      id: id,
      starValue: starValue
    });
  },
  generateItemNotesHTML: function(id) {
    return '<div class="item__notes" data-id="' + id + '"><small>Add some notes about what you did:</small><br> <textarea class="item__notes__input" cols="40" rows="5"></textarea></div>';
  },
  generateItemAdvancedMenuHTML: function(id, open) {
    var openClass = '';
    if (open) {
      openClass = ' item__advanced--open';
    }
    return (
      '<div id="advanced-' +
      id +
      '" class="item__advanced'+ openClass +'">' +
      this.generateTagHTML(id) +
      this.generateItemStarsHTML(id) +
      this.generateItemNotesHTML() +
      "</div>"
    );
  },
  generateItemHTML: function(id, content) {
    // Spit out the final total HTML, combining the card and the advanced menu.
    var newItemHTML =
        '<div id="' +
        id +
        '" class="item-container"> ' +
        this.generateItemCardHTML(id, content) +
        this.generateItemAdvancedMenuHTML(id) +
        "</div>";
    return newItemHTML;
  },
  rebuildItemCard: function(sender, args) {
    $("#" + args.id).find(".accomplishmint-container").replaceWith(this.generateItemCardHTML(args.id, args.newcontent));
  },
  clearAccomplishmintInput: function() {
    // If you don't know what this does, I can't help you.
    this.$input.val("");
  },
  generateRandomEncouragement: function() {
    // This grabs the encouragement data from the Model and randomizes an output
    return this.model.encouragements[
      Math.floor(Math.random() * this.model.encouragements.length)
    ];
  },
  displayNewEncouragement: function() {
    var encouragement = this.generateRandomEncouragement();
    var messageID = $.now();
    // Add to the messageZIndex so that each new message displays on top of the other
    this.model.messageZIndex++;
    // Add a new message to the message container
    this.$messageContainer.prepend(
      '<div id="message__' +
      messageID +
      '" class="message" style="z-index:' +
      this.model.messageZIndex +
      '">' +
      encouragement +
      "</div>"
    );
    // As soon as the message div is created, show the message, then hide it after a certain amount of time.
    $("#message__" + messageID).slideDown(250, "swing");
    setTimeout(function() {
      $("#message__" + messageID).slideUp(250, "swing");
      setTimeout(function() {
        $("#message__" + messageID).remove();
      }, 250);
    }, 3500);
  }
};