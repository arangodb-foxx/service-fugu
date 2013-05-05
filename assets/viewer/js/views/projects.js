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
			new app.NewProjectView();
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
			$('#content').html( this.projectViewTemplate() );

			this.collection = app.Projects;
			this.collection.fetch().done( _.bind(this.render, this) );
		},

		render: function() {
			var html = this.projectListTemplate({ projects: this.collection.toJSON() });
			$('#project-list').html(html);
			return this;
		}
	});
})(jQuery);