/*global Backbone, jQuery, _ */
var app = app || {};

(function ($) {
	'use strict';

	app.EditProjectView = Backbone.View.extend({

		el: '#content',

		editProjectViewTemplate : _.template( $('#edit-project-template').html() ),

		events: {
			'submit form'       : 'submitForm',
			'click .btn-cancel' : 'cancelForm'
		},

		submitForm: function() {
			this.options.project.set('name', this.$el.find('input[name=projectName]').val());
			this.options.project.save();
			new app.ProjectView();

			return false;
		},

		cancelForm: function() {
			new app.ProjectView();
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