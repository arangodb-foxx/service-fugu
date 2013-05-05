'use strict';

var arangodb = require("org/arangodb");
var db       = arangodb.db;

var collections = [
  'projects',
  'errors'
];

for (var i = 0, len = collections.length; i < len; i++) {
  var _coll = app.collectionName(collections[i]);
  if (db._collection(_coll) !== null) {
    db._collection(_coll).drop();
   }
}
