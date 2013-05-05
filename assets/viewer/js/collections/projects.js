/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	var ProjectCollection = Backbone.Collection.extend({
		model : Backbone.Model.extend({ idAttribute: "_key" }),
		url   : 'projects'
	});

	app.Projects = new ProjectCollection();
})();