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
