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
    this.checkboxToggleControllerHandler = this.checkboxToggleController.bind(this);
    this.masterDeleteClickedHandler = this.masterDeleteController.bind(this);
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
    this.view.checkboxToggleEvent.attach(this.checkboxToggleControllerHandler);
    this.view.masterDeleteClickedEvent.attach(this.masterDeleteClickedHandler);
    // On App Load, Do This
    this.startBuildingList();
    return this;
  },
  masterDeleteController: function() {
    this.model.masterDelete();
  },
  checkboxToggleController: function(sender, args) {
    var event = args.event;
    var checked = event.target.checked;
    if (checked) {
      this.addItemToSelectionArray(event);
      return;
    }
    this.removeItemFromSelectionArray(event);
  },
  addItemToSelectionArray: function(event) {
    var id = $(event.target).closest('.item-container').attr('id');
    this.model.addItemToSelectionArray(id);
  },
  removeItemFromSelectionArray: function(event) {
    var id = $(event.target).closest('.item-container').attr('id');
    this.model.removeItemFromSelectionArray(id);
  },
  keyActionsController: function(sender, args) {
    var event = args.event;
    var $input = event.target.className;
    var key = event.originalEvent.keyCode;

    if ($input === 'accomplishmint__input') {
      if (key === 13 || key === 10) {
        event.preventDefault();
        this.addAccomplishmint(args);
      }
      return;
    }
    if ($input === 'item__notes__input') {
      this.updateNoteContent(args);
      return;
    }
    if ($input === "editable-accomplishmint") {
      if (key === 13 || key === 10) {
        event.preventDefault();
        this.saveEditedAccomplishmint(sender, args);
      }
      return;
    }
    if ($input === 'item__tag__input') {
      if (key === 13 || key === 10) {
        event.preventDefault();
        this.addNewTagToItem(args);
      }
      return;
    }
  },
  updateNoteContent:function(args) {
    var event = args.event;
    var id = $(event.target).closest('.item-container').attr('id');
    var noteContent = event.target.value;
    this.model.updateNoteContent(id, noteContent);
  },
  addNewTagToItem: function(args) {
    // Tell the model it needs to add a new tag to the item in its data
    var id = $(event.target).closest('.item-container').attr('id'); 
    var content = args.event.target.value;
    this.model.addNewTagToItem(id, content);
    $("#advanced-"+id).find("#item__tag__input").focus();
  },
  deleteItemTag: function(sender, args) {
    this.model.deleteItemTag(args);
  },
  saveEditedAccomplishmint: function(sender, args) {
    // Grab the id, do some stuff that maybe the controller shouldn't be doing,
    // and save it in the model.
    var event = args.event;
    var id = $(event.target).closest('.item-container').attr('id');
    var newcontent = $("#"+id).find('.editable-accomplishmint').val();
    $("#advanced-" + id).removeClass("item__advanced--open");
    this.model.saveEditedAccomplishmint(id, newcontent);
  },
  addAccomplishmint: function(args) {
    this.model.addAccomplishmint(args.event.target.value);
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