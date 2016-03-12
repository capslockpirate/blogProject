$(function() {
	var blog = {
		init: function() {
			blog.clickListeners();
		},
		getPosts: function() {},
		createPost: function() {},
		editPost: function() {},
		deletePost: function() {},
		clickListeners: function() {
			//click #post__add
			$('#post__add').click(function() {
				blog.createPost();
			});
			$('body').on('click','#post__remove', function() {
				blog.deletePost();
				$(this).parent().remove();
			});
		}

	};

blog.init();
});