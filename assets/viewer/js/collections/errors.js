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
