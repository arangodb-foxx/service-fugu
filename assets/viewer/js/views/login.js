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
