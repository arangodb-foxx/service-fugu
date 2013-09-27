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
