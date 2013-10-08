(function() {
  'use strict';

  var db = require("org/arangodb").db;

  // tear down collections
  [ 'projects', 'errors' ].forEach(function(name) {
    var coll = applicationContext.collectionName(name);
    if (db._collection(coll) !== null) {
      db._collection(coll).drop();
    }
  });
  
  // tear down authentication
  var f = require("org/arangodb/foxx/authentication");
 
  var users = new f.Users(applicationContext);
  users.teardown();
  
  var sessions = new f.Sessions(applicationContext);
  sessions.teardown();
}());
