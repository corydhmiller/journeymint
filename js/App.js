/* 
Bugs:
- iOS has some entry/tapping bugs.

Notes:
- Recently realized the whole event.CurrentTarget parent thing. Wonder if I can set it up so instead of giving a data-id to every single possible element, I can just target the parent.

Roadmap:
- Notes
- Selection of multiple items
- Revamped scoring
- Currency (what?)
- Archive

*/

//Uncomment this to reset the tags
//localStorage.removeItem("accomplishmintsAppStorage--tags");

$(function() {
  var model = new mintModel(),
      view = new mintView(model),
      controller = new mintController(model, view);
});