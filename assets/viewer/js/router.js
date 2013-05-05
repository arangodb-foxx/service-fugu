/*global Backbone, _ */
var app = app || {};

(function () {
	'use strict';

	// Remove bindings from old views
	_.extend(app, Backbone.Events);
	app.currentView = undefined;

	app.on('view:change', function(newView) {
		if (app.currentView) { app.currentView.stopListening(); }
		app.currentView = newView;
	});


	var Router = Backbone.Router.extend({
		routes: {
			''            : 'showProjects',
			':key'        : 'editProjectDetails',
			':key/'       : 'editProjectDetails',
			':key/errors' : 'showProjectErrors'
		},

		initialize: function() {
			Backbone.history.start();
		},

		showProjects: function() {
			new app.ProjectView();
		},

		editProjectDetails: function(key) {
			new app.EditProjectView({projectKey: key});
		},

		showProjectErrors: function(key) {
			new app.ErrorView({projectKey: key});
		}
	});

	app.TodoRouter = new Router();

})();