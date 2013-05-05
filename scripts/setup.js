'use strict';

var console  = require("console");
var arangodb = require("org/arangodb");
var db       = arangodb.db;

var collections = [
  'projects',
  'errors'
];

for (var i = 0, len = collections.length; i < len; i++) {
  var _coll = app.collectionName(collections[i]);
  if (db._collection(_coll) === null) {
    db._create(_coll);
  } else {
    console.warn("collection '%s' already exists. Leaving it untouched.", _coll);
  }
}
