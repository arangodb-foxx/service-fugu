/*global Backbone */
var app = window.app || {};

(function () {
	'use strict';

	var ProjectCollection = Backbone.Collection.extend({
		model : Backbone.Model.extend({ idAttribute: "_key" }),
		url   : 'viewer/projects'
	});

	app.Projects = new ProjectCollection();
})();
