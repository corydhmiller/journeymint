var mintModel=function(){"use strict";this.accomplishmints=[],this.tags=[],this.datesInArchive=[],this.totalScore=0,this.score=0,this.messageZIndex=1e3,this.encouragements=["Great job!","Well done!","You've done great things!","Be proud of yourself!","All right!","Woo, don't stop now!","You're on fire!","Nothing can stop you now!","That's impressive!","Fantastic!","You've got this!","Amazing!","So good!"],this.addAccomplishmintEvent=new Event(this),this.deleteAccomplishmintEvent=new Event(this),this.saveEditedAccomplishmintEvent=new Event(this),this.retrieveAccomplishmintsFromStorageEvent=new Event(this),this.putAccomplishmintsIntoStorageEvent=new Event(this),this.updateItemTagsEvent=new Event(this),this.addItemTagEvent=new Event(this),this.deleteItemTagEvent=new Event(this),this.updateTodaysScoreEvent=new Event(this),this.displayTagErrorEvent=new Event(this),this.database=new Database,this.DateFactory=new DateFactory};mintModel.prototype={getAccomplishmints:function(){return this.accomplishmints},getAccomplishmintScore:function(t){var i=t.length;return i=isNaN(parseFloat(i))?0:parseFloat(i)},getDateInt:function(){return this.DateFactory.getInt()},sanitizeText:function(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;")},addAccomplishmint:function(t){if(t&&t.replace(/\s/g,"").length){t=this.sanitizeText(t);var i=$.now(),s=this.getAccomplishmintScore(t),e=this.getDateInt(),n={date:e,id:i,content:t,score:s,goal:"",tags:[],stars:0,notes:void 0};this.accomplishmints.push(n),this.putAccomplishmintsIntoStorage(),this.addAccomplishmintEvent.notify(n),this.updateTodaysScoreEvent.notify()}},saveEditedAccomplishmint:function(t,i){i=this.sanitizeText(i);for(var s=this.accomplishmints,e=s.length-1;e>=0;e--)s[e].id===t&&(s[e].content=i,s[e].score=this.getAccomplishmintScore(i));this.putAccomplishmintsIntoStorage(),this.saveEditedAccomplishmintEvent.notify({id:t}),this.updateTodaysScoreEvent.notify()},deleteAccomplishmint:function(t){var i=this.accomplishmints.sort();t=parseInt(t);for(var s=i.length-1;s>=0;s--)i[s].id===t&&i.splice(s,1);this.putAccomplishmintsIntoStorage(),this.updateTodaysScoreEvent.notify(),this.deleteAccomplishmintEvent.notify({id:t})},checkThroughArrayForNumber:function(t,i){return i.indexOf(t)>-1},addClassForATime:function(t,i,s){t.removeClass(i),setTimeout(function(){t.addClass(i)},s),t.removeClass(i)},addNewTagToItem:function(t,i){t=parseInt(t);var s=this.tags,e=this.accomplishmints;for(var n in s)if(s[n].tagname===i){var a=s[n].tagid;for(var o in e)if(e[o].id===t)return this.checkThroughArrayForNumber(a,e[o].tags)?void this.displayTagErrorEvent.notify({id:t,tagid:a}):(e[o].tags.push(a),this.putAccomplishmintsIntoStorage(),void this.addItemTagEvent.notify({id:t,tagid:a,tagname:i}))}var h=1;for(var c in s)s[c].tagid===h&&h++;s.push({tagid:h,tagname:i});for(var r in e)e[r].id===t&&e[r].tags.push(h);this.database.set({storageItem:s,storageUnit:"accomplishmintsAppStorage--tags"}),this.putAccomplishmintsIntoStorage(),this.addItemTagEvent.notify({id:t,tagid:h,tagname:i})},deleteItemTag:function(t){for(var i in this.accomplishmints)if(this.accomplishmints[i].id===t.id){var s=this.accomplishmints[i].tags.indexOf(t.tagid);s>-1&&this.accomplishmints[i].tags.splice(s,1)}this.putAccomplishmintsIntoStorage(),this.deleteItemTagEvent.notify({id:t.id,tagid:t.tagid})},updateStarLevel:function(t,i){i=parseInt(i),t=parseInt(t);for(var s in this.accomplishmints)this.accomplishmints[s].id===t&&(this.accomplishmints[s].stars=i);this.putAccomplishmintsIntoStorage()},putAccomplishmintsIntoStorage:function(){this.database.set({storageItem:this.accomplishmints,storageUnit:"accomplishmintsAppStorage"}),this.putAccomplishmintsIntoStorageEvent.notify()},retrieveAccomplishmintsFromStorage:function(){var t=this.database.get({storageUnit:"accomplishmintsAppStorage"});null===t||""===t||(this.accomplishmints=t),this.updateDatesInArchive(),this.retrieveAccomplishmintsFromStorageEvent.notify()},updateDatesInArchive:function(){var t=this.accomplishmints;this.datesInArchive=[];for(var i in t){var s=jQuery.inArray(t[i].date,this.datesInArchive);s>=0||this.datesInArchive.push(t[i].date)}},retrieveTagsFromStorage:function(){var t=this.database.get({storageUnit:"accomplishmintsAppStorage--tags"});null===t||""===t||(this.tags=t)}};