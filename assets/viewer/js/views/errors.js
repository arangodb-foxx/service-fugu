/*global Backbone, jQuery, _ */
var app = app || {};

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
				this.collection.url = 'projects/' + this.options.projectKey;
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