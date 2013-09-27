/*jshint unused:false */
/*global console:true, repositories */

'use strict';

console  = require('console');

// Initialise a new FoxxApplication
var Foxx = require("org/arangodb/foxx");

var controller = new Foxx.Controller(applicationContext);

// Register Repositories (ArangoDB Collections)
var projects = new Foxx.Repository(controller.collection("projects"));
var errors = new Foxx.Repository(controller.collection("errors"));

// List all projects
controller.get("/projects", function(req, res) {
  res.json(projects.collection.toArray());
});


// Create new project
controller.post("/projects", function(req, res) {
  var content = JSON.parse(req.requestBody);
  if (content.name) {
    var newProject = projects.collection.save({ name: content.name });
    res.json(newProject);
  }
});


// Edit project
controller.put("/projects/:key", function(req, res) {
  var content = JSON.parse(req.requestBody);
  if (content.name) {
    projects.collection.updateByExample({ "_key": req.params("key") }, { name: content.name });
  }
});


// Delete project
controller.delete("/projects/:key", function(req, res) {
  projects.collection.removeByExample({ "_key": req.params("key") });
});


// List errors for project with _key xxx
controller.get("/projects/:key", function(req, res) {
  res.json(errors.collection.byExample("project_key", req.params("key")).toArray());
});

