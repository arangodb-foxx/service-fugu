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

/*global Backbone */
var app = window.app || {};

(function () {
	'use strict';

	var ErrorCollection = Backbone.Collection.extend({
		model: Backbone.Model.extend({
			idAttribute: "_key",
			parse: function(res) {
				if (res.timeStamp) {
					res.timeStamp = new Date(res.timeStamp);
				}
				return res;
			}
		})
	});

	app.Errors = new ErrorCollection();

})();

/*global Backbone, jQuery, _ */
var app = window.app || {};

(function ($) {
	'use strict';

	app.LoginView = Backbone.View.extend({
		el: '#content',

		LoginViewTemplate        : _.template( $('#login-template').html() ),

		events: {
			'submit form'       : 'submitForm'
		},

		submitForm: function(event) {
                        event.preventDefault();
			var username = this.$el.find('input[name=username]').val();
			var password = this.$el.find('input[name=password]').val();

                        $.ajax({
                                url: 'viewer/login',
                                type: 'post',
                                dataType: 'json',
                                contentType: 'application/json',
                                data: JSON.stringify({ username: username, password: password }),
                                success: function(data) {
                                        app.Router.navigate("home", { trigger: true });
                                        $('#logout').removeAttr("disabled");
                                        $('#logout').css("visibility", "visible");
                                },
                                error: function(data) {
                                        alert('Invalid credentials. Please try again.');
                                }
                        });

		},

		initialize: function() {
			app.trigger('view:change', this);
                        $('#logout').attr("disabled", "disabled");
                        $('#logout').css("visibility", "hidden");

			$('#content').html(this.LoginViewTemplate());
		}

	});
})(jQuery);

/*global window, Backbone, jQuery, _ */
var app = app || {};

(function ($) {
	'use strict';

	app.ProjectView = Backbone.View.extend({

		el: '#content',

		projectViewTemplate: _.template( $('#project-view-template').html() ),
		projectListTemplate: _.template( $('#project-list-template').html() ),

		events: {
			'click .new-project'    : 'showNewProjectView',
			'click .delete-project' : 'deleteProject'
		},

		showNewProjectView: function() {
                        app.Router.navigate("new", { trigger: true });
		},

		deleteProject: function(event) {
			var button = $(event.target).closest('button');
			if (button && window.confirm('Are you sure you want to delete project "' + button.attr('data-name') + '" and lose all your logs?')) {
				var model = this.collection.get(button.attr('data-key'));
				if (model) {
					model.destroy();
					this.render();
				}
			}
		},

		initialize: function() {
			app.trigger('view:change', this);
                        $('#logout').removeAttr("disabled");
                        $('#logout').css("visibility", "visible");

			this.collection = app.Projects;
			this.collection.fetch().done( _.bind(this.render, this) );
		},

		render: function() {
			app.trigger('view:change', this);
			$('#content').html( this.projectViewTemplate() );
			var html = this.projectListTemplate({ projects: this.collection.toJSON() });
			$('#project-list').html(html);
			return this;
		}

	});
})(jQuery);

/*global Backbone, jQuery, _ */
var app = window.app || {};

(function ($) {
	'use strict';

	app.NewProjectView = Backbone.View.extend({

		el: '#content',

		newProjectViewTemplate        : _.template( $('#new-project-template').html() ),
		newProjectSuccessViewTemplate : _.template( $('#new-project-success-template').html() ),

		events: {
			'submit form'       : 'submitForm',
			'click .btn-cancel' : 'cancelForm'
		},

		submitForm: function(event) {
                        event.preventDefault();
			var name = this.$el.find('input[name=projectName]').val();
                        name = name.replace(/(^\s+|\s+$)/g, '');

                        if (name === '') {
                            alert('Please enter a valid name');
                            return; 
                        }

			var view = this;
                        var project = this.collection.create(
                            { name: name },
                            { 
                              wait: true,
                              success: function (model) {
   				  $('#content').html(view.newProjectSuccessViewTemplate({ projectKey: model.get('_key') }));
                              },
                              error: function (model) {
                                  view.collection.remove(model);
                                  alert('Unable to save project. Please choose a different name.');
                              }
                            }
                        );

		},

		cancelForm: function(event) {
                        event.preventDefault();
                        app.Router.navigate("home", { trigger: true });
		},

		initialize: function() {
			app.trigger('view:change', this);

			this.collection = app.Projects;
			$('#content').html(this.newProjectViewTemplate());
		}
	});
})(jQuery);

/*global Backbone, jQuery, _ */
var app = window.app || {};

(function ($) {
	'use strict';

	app.EditProjectView = Backbone.View.extend({

		el: '#content',

		editProjectViewTemplate : _.template( $('#edit-project-template').html() ),

		events: {
			'submit form'       : 'submitForm',
			'click .btn-cancel' : 'cancelForm'
		},

		submitForm: function(event) {
                        event.preventDefault();

			var name = this.$el.find('input[name=projectName]').val();
                        name = name.replace(/(^\s+|\s+$)/g, '');

                        if (name === '') {
                            alert('Please enter a valid name');
                            return; 
                        }

                        var project = this.options.project;
                        project.set('name', name);
			project.on('error', function (model) {
                            alert('Unable to save project. Please choose a different name.');
                        });
			project.on('sync', function (model) {
                            project.off();
                            app.Router.navigate("home", { trigger: true });
                        });

			this.options.project.save();
		},

		cancelForm: function(event) {
                        event.preventDefault();
                        app.Router.navigate("home", { trigger: true });
		},

		initialize: function() {
			app.trigger('view:change', this);
			if (this.options.projectKey) {
				this.collection = app.Projects;
				this.collection.fetch().done( _.bind(this.render, this) );
			}
		},

		render: function() {
			this.options.project = this.collection.get(this.options.projectKey);
			$('#content').html( this.editProjectViewTemplate({ projectName : this.options.project.get('name') }) );
		}
	});
})(jQuery);

/*global Backbone, jQuery, _ */
var app = window.app || {};

(function ($) {
	'use strict';

	app.ErrorView = Backbone.View.extend({

		errorViewTemplate: _.template( $('#error-view-template').html() ),
		errorListTemplate: _.template( $('#error-list-template').html() ),

		getProjectName: function() {
			var view = this;
			app.Projects.fetch().done(function() {
				view.options.projectName = app.Projects.get(view.options.projectKey).get('name');
				view.render();
			});
		},

		initialize: function() {
			app.trigger('view:change', this);

			if (this.options.projectKey) {
				this.collection = app.Errors;
				this.collection.url = 'viewer/projects/' + this.options.projectKey;
				this.collection.fetch().done( _.bind(this.getProjectName, this) );
			}
		},

		render: function() {
			var html = this.errorListTemplate({ errors : this.collection.toJSON() });

			$('#content').html( this.errorViewTemplate({ projectName : this.options.projectName }) );
			$('#error-list').html(html);

			// Truncate link text for layout reasons
			$('a').truncate(400);
			return this;
		}
	});
})(jQuery);

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


