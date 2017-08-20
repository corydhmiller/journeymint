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
    this.keyActionsHandler = this.keyActions.bind(this);
    this.deleteAccomplishmintHandler = this.deleteAccomplishmint.bind(this);
    this.saveEditedAccomplishmintHandler = this.saveEditedAccomplishmint.bind(this);
    this.startBuildingListHandler = this.startBuildingList.bind(this);
    this.tellViewToBuildListHandler = this.tellViewToBuildList.bind(this);
    this.deleteItemTagHandler = this.deleteItemTag.bind(this);
    this.updateStarLevelHandler = this.updateStarLevel.bind(this);
    return this;
  },
  enable: function() {
    // Watch the View
    this.view.startBuildingListEvent.attach(this.startBuildingListHandler);
    this.view.keyActionEvent.attach(this.keyActionsHandler);
    this.view.addAccomplishmintEvent.attach(this.addAccomplishmintHandler);
    this.view.deleteAccomplishmintEvent.attach(this.deleteAccomplishmintHandler);
    this.view.saveEditedAccomplishmintEvent.attach(this.saveEditedAccomplishmintHandler);
    this.view.deleteItemTagClickEvent.attach(this.deleteItemTagHandler);
    this.view.updateStarLevelEvent.attach(this.updateStarLevelHandler);

    // On App Load, Do This
    this.startBuildingList();
    return this;
  },
  keyActions: function(sender, args) {
    // This controller function handles all of the actions by a key
    var key = args.key;
    var input = args.input;

    // If Key is Enter or Return (iOS)
    if (key === 13 || key === 10) {
      // Check to see if the input was the main input or an editable item input
      if (input === "accomplishmint__input") {
        this.addAccomplishmint();
        return false;
      } else if (input === "editable-accomplishmint") {
        // If someone hits the Enter button while focused on a specific item
        this.saveEditedAccomplishmint(sender, args);
        return false;
      } else if (args.event.target.id === "item__tag__input") {
        this.addNewTagToItem(sender, args);
      }
      // If the Enter/Return key is pressed but the input is not specified, end function.
      return;
    }
    // If it doesn't match anything we need to fire something from, end function.
    return;
  },
  addNewTagToItem: function(sender, args) {
    // Tell the model it needs to add a new tag to the item in its data
    this.model.addNewTagToItem(args.id, args.value);
    $("#advanced-"+args.id).find("#item__tag__input").focus();
  },
  deleteItemTag: function(sender, args) {
    this.model.deleteItemTag(args);
  },
  
  saveEditedAccomplishmint: function(sender, args) {
    // Grab the id, do some stuff that maybe the controller shouldn't be doing,
    // and save it in the model.
    var id = args.id;
    $("#advanced-" + id).removeClass("item__advanced--open");
    var newcontent = $("#edit-" + id).val();
    this.model.saveEditedAccomplishmint(id, newcontent);
  },
  addAccomplishmint: function() {
    this.model.addAccomplishmint(this.view.$input.val());
  },
  deleteAccomplishmint: function(sender, args) {
    // Self explanatory
    var id = args.id;
    this.model.deleteAccomplishmint(id);
  },
  updateStarLevel: function(sender, args) {
    this.model.updateStarLevel(args.id, args.starValue);
  },
  tellViewToBuildList: function() {
    // Self explanatory.
    this.view.beforeBuild();
  },
  startBuildingList: function() {
    // This is the initial function that happens.
    this.model.retrieveTagsFromStorage();
    this.model.retrieveAccomplishmintsFromStorage();
  }
};

