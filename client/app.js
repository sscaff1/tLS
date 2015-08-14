Template.posts.onCreated(function () {
	var instance = this;
	
	instance.loaded = new ReactiveVar(0);
	instance.limit = new ReactiveVar(5);
	
	instance.autorun(function () {
		var limit = instance.limit.get();
		console.log("Asking for " + limit + " posts...");
		var subscription = instance.subscribe('posts', limit);
		
		if (subscription.ready()) {
			console.log("> Received " + limit + "posts. \n\n");
			instance.loaded.set(limit);
		} else {
			console.log("> Subscription is not ready yet. \n\n");
		}
	});
	
	instance.posts = function() {
		return Posts.find({}, {limit: instance.loaded.get()});
	};
});

Template.posts.events({
	'click .load-more': function (e, instance) {
		e.preventDefault();
		var limit = instance.limit.get();
		limit += 5;
		instance.limit.set(limit);
	}
});

Template.posts.helpers({
	posts: function () {
		return Template.instance().posts();
	},
	hasMorePosts: function () {
		return Template.instance().posts().count() >= Template.instance().limit.get();
	}
});