(function () {
  'use strict';

  var console  = require("console");
  var db       = require("org/arangodb").db;

  // setup projects & errors collection
  [ 'projects', 'errors' ].forEach(function(name) {
    var coll = applicationContext.collectionName(name);
    if (db._collection(coll) === null) {
      db._create(coll);
    } else {
      console.log("collection '%s' already exists. Leaving it untouched.", coll);
    }

    if (name === 'projects') {
      db[coll].ensureUniqueConstraint("name");
    }
    else if (name === 'errors') {
      db[coll].ensureSkiplist('project_key');
    }
  });

  // setup authentication
  var f = require("org/arangodb/foxx/authentication");

  // set up users
  var users = new f.Users(applicationContext);
  users.setup({ journalSize: 1 * 1024 * 1024 });

  // set up a default admin user
  users.add("admin", "secret", true, {
    name: "Root",
    admin: true
  });

  // set up sessions
  var s = new f.Sessions(applicationContext);
  s.setup();
}());
