var mintController=function(t,e){this.model=t,this.view=e,this.init()};mintController.prototype={init:function(){this.setupHandlers().enable()},setupHandlers:function(){return this.addAccomplishmintHandler=this.addAccomplishmint.bind(this),this.deleteAccomplishmintHandler=this.deleteAccomplishmint.bind(this),this.saveEditedAccomplishmintHandler=this.saveEditedAccomplishmint.bind(this),this.deleteItemTagHandler=this.deleteItemTag.bind(this),this.updateStarLevelHandler=this.updateStarLevel.bind(this),this.keyActionsHandler=this.keyActionsController.bind(this),this},enable:function(){return this.view.addAccomplishmintEvent.attach(this.addAccomplishmintHandler),this.view.deleteAccomplishmintEvent.attach(this.deleteAccomplishmintHandler),this.view.saveEditedAccomplishmintEvent.attach(this.saveEditedAccomplishmintHandler),this.view.deleteItemTagClickEvent.attach(this.deleteItemTagHandler),this.view.updateStarLevelEvent.attach(this.updateStarLevelHandler),this.view.keyWasPressedEvent.attach(this.keyActionsHandler),this.startBuildingList(),this},keyActionsController:function(t,e){var i=e.event,n=$(i.target).closest(".item-container").attr("id"),s=i.target.className,a=i.target.value,d=i.originalEvent.keyCode;return"accomplishmint__input"===s?void((13===d||10===d)&&(i.preventDefault(),this.addAccomplishmint(a))):"editable-accomplishmint"===s?void((13===d||10===d)&&(i.preventDefault(),this.saveEditedAccomplishmint(n,a))):"item__tag__input"===s?void((13===d||10===d)&&(i.preventDefault(),this.addNewTagToItem(n,a))):void 0},addNewTagToItem:function(t,e){this.model.addNewTagToItem(t,e),$("#advanced-"+t).find("#item__tag__input").focus()},deleteItemTag:function(t,e){this.model.deleteItemTag(e)},saveEditedAccomplishmint:function(t,e){$("#advanced-"+t).removeClass("item__advanced--open"),this.model.saveEditedAccomplishmint(t,e)},addAccomplishmint:function(t){this.model.addAccomplishmint(t)},deleteAccomplishmint:function(t,e){var i=e.id;this.model.deleteAccomplishmint(i)},updateStarLevel:function(t,e){this.model.updateStarLevel(e.id,e.starValue)},startBuildingList:function(){this.model.retrieveTagsFromStorage(),this.model.retrieveAccomplishmintsFromStorage()}};