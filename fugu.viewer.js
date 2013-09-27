/*jshint unused:false */
/*global console:true, repositories */

(function() {
  "use strict";

  console  = require('console');

  // Initialise a new FoxxApplication
  var Foxx = require("org/arangodb/foxx");

  var controller = new Foxx.Controller(applicationContext);
  var db = require("org/arangodb").db;

  // Register repositories (ArangoDB collections)
  var projects = new Foxx.Repository(controller.collection("projects"));
  var errors = new Foxx.Repository(controller.collection("errors"));
  
  // Set up authentication
  controller.activateAuthentication({
    type: "cookie",
    cookieName: "fugu-viewer-id",
    cookieLifetime: 60 * 60 * 24 * 3,
    sessionLifetime: 60 * 60
  });
  
  controller.login("/login", {
    onSuccess: function (req, res) {
      res.json({
        msg: "Logged in!",
        user: req.user.identifier,
        key: req.currentSession._key
      });
    }
  });

  controller.logout("/logout");

  // Routes follow
  // -------------------------------------------------

  // List all projects
  controller.get("/projects", function(req, res) {
    var query = "FOR p IN @@projects LET errors = SUM((FOR e IN @@errors FILTER e.project_key == p._key RETURN 1)) SORT p.name RETURN { _key: p._key, name: p.name, errors: errors }";
    var bind = { 
      "@projects": projects.collection.name(), 
      "@errors": errors.collection.name()
    };
    
    var result = db._query(query, bind).toArray();
    res.json(result);
  }).onlyIfAuthenticated(401, "Only logged in users can use the viewer");


  // Create new project
  controller.post("/projects", function(req, res) {
    var content = req.body();
    if (content.name) {
      var newProject = projects.collection.save({ name: content.name });
      res.json(newProject);
    }
  }).onlyIfAuthenticated(401, "Only logged in users can use the viewer");


  // Edit project
  controller.put("/projects/:key", function(req, res) {
    var content = req.body();
    if (content.name) {
      projects.collection.update(req.params("key"), { name: content.name });
    }

    res.json({ ok: true });
  }).onlyIfAuthenticated(401, "Only logged in users can use the viewer");


  // Delete project
  controller.delete("/projects/:key", function(req, res) {
    errors.collection.removeByExample({ project_key: req.params("key") });
    projects.collection.remove(req.params("key"));
  }).onlyIfAuthenticated(401, "Only logged in users can use the viewer");


  // List errors for project with _key xxx
  controller.get("/projects/:key", function(req, res) {
    res.json(errors.collection.byExample("project_key", req.params("key")).toArray());
  }).onlyIfAuthenticated(401, "Only logged in users can use the viewer");

}());
