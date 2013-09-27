/*global Backbone, _ */
var app = window.app || {};

(function () {
	'use strict';

	// Remove bindings from old views
	_.extend(app, Backbone.Events);
	app.currentView = undefined;

	app.on('view:change', function(newView) {
		if (app.currentView && app.currentView !== newView) { 
                    app.currentView.undelegateEvents();
                }
		app.currentView = newView;
	});


	var Router = Backbone.Router.extend({
		routes: {
			''            : 'showProjects',
			'home'        : 'showProjects',
                        'new'         : 'newProject',
			'edit/:key'   : 'editProjectDetails',
			':key/errors' : 'showProjectErrors',
                        'login'       : 'login',
                        'logout'      : 'logout'
		},

		initialize: function() {
			Backbone.history.start();
		},

                login: function() {
                        new app.LoginView();
                },

                logout: function() {
                        $.ajax({
                                url: "viewer/logout",
                                type: "post",
                                dataType: "json",
                                success: function(result) {
                                        $('#logout').attr("disabled", "disabled");
                                        window.app.Router.navigate('login', { trigger: true});
                                },
                                error: function(result) {
                                        alert('Unable to log out');
                                }
                        });
                },

                newProject: function() {
			new app.NewProjectView();
                },

		showProjects: function() {
                        new app.ProjectView();
		},

		editProjectDetails: function(key) {
			new app.EditProjectView({ projectKey: key });
		},

		showProjectErrors: function(key) {
			new app.ErrorView({ projectKey: key });
		}
	});

        $.ajaxSetup({
                statusCode: {
                      401: function(){
                            window.app.Router.navigate('login', { trigger: true });
//                            window.location.replace('/#login');
                      },
                      403: function() {
                            window.app.Router.navigate('login', { trigger: true });
                            //window.location.replace('/#denied');
                      }
                }
        });

        app.Router = new Router();
        
        $('#logout').on('click', function () {
                app.Router.logout();
        });
	

})();


