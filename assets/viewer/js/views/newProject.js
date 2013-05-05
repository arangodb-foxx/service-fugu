/*global Backbone, jQuery, _ */
var app = app || {};

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

		submitForm: function() {
			var view = this;
			this.collection.on('sync', function(model) {
				$('#content').html(view.newProjectSuccessViewTemplate({ projectKey: model.get('_key') }));
			});

			this.collection.create(
				{ name : this.$el.find('input[name=projectName]').val() },
				{ wait: true }
			);
			return false;
		},

		cancelForm: function() {
			new app.ProjectView();
		},

		initialize: function() {
			app.trigger('view:change', this);

			this.collection = app.Projects;
			$('#content').html(this.newProjectViewTemplate());
		}
	});
})(jQuery);