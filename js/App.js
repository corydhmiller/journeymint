$(function() {
  var model = new mintModel(),
      view = new mintView(model),
      controller = new mintController(model, view);
});