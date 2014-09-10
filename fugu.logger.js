'use strict';

var console  = require('console');
var UAParser = require('./lib/ua-parser');

// Initialise a new FoxxApplication
var Foxx = require("org/arangodb/foxx");

// this controller
var controller = new Foxx.Controller(applicationContext);

// Register Repositories (ArangoDB Collections)
var projects = new Foxx.Repository(applicationContext.collection("projects"));
var errors = new Foxx.Repository(applicationContext.collection("errors"));

controller.post("/:projectkey", function(req, res) {
  var content = '';

  try {
    content = JSON.parse(req.requestBody);
    content.timeStamp = (new Date()).toISOString();
    content.userAgent = (new UAParser(req.headers['user-agent'] || '')).getResult();

    var project = projects.collection.firstExample("_key", req.params("projectkey"));
    if (project && project._key) {
      content.project_key = project._key;
      errors.collection.save(content);
    }
  } catch(e) {
    console.error('[Fugu] Unable to parse error request body.'+ e.message);
  }

  res.set('Access-Control-Allow-Origin', '*');
  res.set('Content-Type', 'text/plain');
});
