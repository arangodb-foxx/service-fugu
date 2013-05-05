/*jshint unused:false */
/*global console:true, repositories */

'use strict';

console  = require('console');

// Initialise a new FoxxApplication
var FoxxApplication = require("org/arangodb/foxx").Application;
var app = new FoxxApplication();

// Register Repositories (ArangoDB Collections)
var projects = app.registerRepository('projects');
var errors   = app.registerRepository('errors');


// List all projects
app.get("/projects", function(req, res) {
  res.json(repositories.projects.collection.toArray());
});


// Create new project
app.post("/projects", function(req, res) {
  var content = JSON.parse(req.requestBody);
  if (content.name) {
    var newProject = repositories.projects.collection.save({ name: content.name });
    res.json(newProject);
  }
});


// Edit project
app.put("/projects/:key", function(req, res) {
  var content = JSON.parse(req.requestBody);
  if (content.name) {
    repositories.projects.collection.updateByExample({ "_key": req.params("key") }, { name: content.name });
  }
});


// Delete project
app.delete("/projects/:key", function(req, res) {
  repositories.projects.collection.removeByExample({ "_key": req.params("key") });
});


// List errors for project with _key xxx
app.get("/projects/:key", function(req, res) {
  res.json(repositories.errors.collection.byExample("project_key", req.params("key")).toArray());
});


app.start(applicationContext);
