/*jshint unused:false */
/*global console:true, UAParser:true, repositories */

'use strict';

console  = require('console');
UAParser = require('./lib/ua-parser');

// Initialise a new FoxxApplication
var FoxxApplication = require("org/arangodb/foxx").Application;
var app = new FoxxApplication();

// Register Repositories (ArangoDB Collections)
var projects = app.registerRepository('projects');
var errors   = app.registerRepository('errors');


app.post("/:projectkey", function(req, res) {
  var content = '';

  try {
    content = JSON.parse(req.requestBody);
    content.timeStamp = (new Date()).toISOString();
    content.userAgent = (new UAParser(req.headers['user-agent'] || '')).getResult();

    var project = repositories.projects.collection.firstExample("_key", req.params("projectkey"));
    if (project && project._key) {
      content.project_key = project._key;
      repositories.errors.collection.save(content);
    }
  } catch(e) {
    console.error('[Fugu] Unable to parse error request body.');
  }

  res.set('Access-Control-Allow-Origin', '*');
  res.set('Content-Type', 'text/plain');
});


app.start(applicationContext);
