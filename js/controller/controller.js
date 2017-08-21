var mintController = function(model, view) {
  this.model = model;
  this.view = view;

  this.init();
};

mintController.prototype = {
  init: function() {
    this.setupHandlers().enable();
  },
  setupHandlers: function() {
    this.addAccomplishmintHandler = this.addAccomplishmint.bind(this);
    this.deleteAccomplishmintHandler = this.deleteAccomplishmint.bind(this);
    this.saveEditedAccomplishmintHandler = this.saveEditedAccomplishmint.bind(this);
    this.deleteItemTagHandler = this.deleteItemTag.bind(this);
    this.updateStarLevelHandler = this.updateStarLevel.bind(this);
    this.keyActionsHandler = this.keyActionsController.bind(this);
    return this;
  },
  enable: function() {
    // Watch the View
    this.view.addAccomplishmintEvent.attach(this.addAccomplishmintHandler);
    this.view.deleteAccomplishmintEvent.attach(this.deleteAccomplishmintHandler);
    this.view.saveEditedAccomplishmintEvent.attach(this.saveEditedAccomplishmintHandler);
    this.view.deleteItemTagClickEvent.attach(this.deleteItemTagHandler);
    this.view.updateStarLevelEvent.attach(this.updateStarLevelHandler);
    this.view.keyWasPressedEvent.attach(this.keyActionsHandler);

    // On App Load, Do This
    this.startBuildingList();
    return this;
  },
  keyActionsController: function(sender, args) {
    var event = args.event;
    var id = $(event.target).closest('.item-container').attr('id'); 
    var $input = event.target.className;
    var content = event.target.value;
    var key = event.originalEvent.keyCode;

    if ($input === 'accomplishmint__input') {
      if (key === 13 || key === 10) {
        event.preventDefault();
        this.addAccomplishmint(content);
      }
      return;
    }
    if ($input === "editable-accomplishmint") {
      if (key === 13 || key === 10) {
        event.preventDefault();
        this.saveEditedAccomplishmint(id, content);
      }
      return;
    }
    if ($input === 'item__tag__input') {
      if (key === 13 || key === 10) {
        event.preventDefault();
        this.addNewTagToItem(id, content);
      }
      return;
    }
  },
  addNewTagToItem: function(id, content) {
    // Tell the model it needs to add a new tag to the item in its data
    this.model.addNewTagToItem(id, content);
    $("#advanced-"+id).find("#item__tag__input").focus();
  },
  deleteItemTag: function(sender, args) {
    this.model.deleteItemTag(args);
  },
  
  saveEditedAccomplishmint: function(id, newcontent) {
    // Grab the id, do some stuff that maybe the controller shouldn't be doing,
    // and save it in the model.
    $("#advanced-" + id).removeClass("item__advanced--open");
    this.model.saveEditedAccomplishmint(id, newcontent);
  },
  addAccomplishmint: function(content) {
    this.model.addAccomplishmint(content);
  },
  deleteAccomplishmint: function(sender, args) {
    // Self explanatory
    var id = args.id;
    this.model.deleteAccomplishmint(id);
  },
  updateStarLevel: function(sender, args) {
    this.model.updateStarLevel(args.id, args.starValue);
  },
  startBuildingList: function() {
    // This is the initial function that happens.
    this.model.retrieveTagsFromStorage();
    this.model.retrieveAccomplishmintsFromStorage();
  }
};