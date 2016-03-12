$(function() {
  var blog = {
    ENDPOINT: '/v1/posts/',
    local_mode: true,
    buttons: {
      add: $('#post__add'),
      create: $('#post__create')
    },
    localPosts: [{
      "id": "97f95f75-0c02-4449-af28-5ec742fdaab0",
      "title": "First Post",
      "text": "Woot, this is my first blog post. I'm really interesting!!!",
      "timestamp": "2015-03-25T12:00:00"
      },
      {
      "id": "85f95f75-7to9-4777-bd27-5sr742fdnn77",
      "title": "Second Post",
      "text": "Woot, this is my first blog post. I'm really interesting!!!",
      "timestamp": "2016-03-2T12:00:00"
    }],
    init: function() {
      blog.clickListeners();
      blog.getPosts();
    },
    getPosts: function() {
      if (blog.local_mode) {
        blog.localPosts.forEach(function(el, i, arr) {
          blog.createPostHtml(el);
        });
      } else {
        $.ajax({
          url: blog.ENDPOINT,
          method: 'GET',
          success: function(posts) {
            posts.forEach(function(el, i, arr) {
              blog.createPostHtml(el);
            });
          }
        });
      }
    },
    createPost: function(postObj) {
      console.log(postObj);
      if(blog.local_mode){
        postObj.timestamp = new Date().toISOString();
        //assuming the server creates id this just makes a random number for local testing
        postObj.id = Math.floor(Math.random() * 1000);
        blog.localPosts.push(postObj);
        console.log(blog.localPosts);
        blog.createPostHtml(postObj);


      } else {

        $.ajax({
          url: blog.ENDPOINT,
          method: 'POST',
          data: postObj,
          success: function(createdPost) {
            //assume here that response would be the full post object with ID and timestamp
            blog.createPostHtml(createdPost);
          }
        });
      }

    },
    editPost: function(updatePostObj) {
      console.log(updatePostObj);

          $('.post__item[data-id="'+ updatePostObj.id+'"]').children('h2').text(updatePostObj.title);
          $('.post__item[data-id="'+ updatePostObj.id+'"]').children('p').text(updatePostObj.text);

      $.ajax({
        url: blog.ENDPOINT + updatePostObj.id,
        method: 'POST',
        data: {"title": updatePostObj.title, "text": updatePostObj.text},
        success: function(response) {
          $('.post__item[data-id="'+ updatePostObj.id+'"]').children('h2').text(response.title);
          $('.post__item[data-id="'+ updatePostObj.id+'"]').children('p').text(response.text);
        }
      });
    },
    deletePost: function(postId) {
      $.ajax({
        url: blog.ENDPOINT + postId,
        method: 'DELETE',
        success: function(response) {
          alert('Post Deleted');
        }
      });
    },
    createPostHtml: function(postObj) {
      
      var $postHtml = $('<div></div>');

      $postHtml
        .addClass('post__item')
        .attr('data-id', postObj.id)
        .append('<h2 class="post__title">' + postObj.title + '</h2>')
        .append('<div class="post__date">' + postObj.timestamp + '</div>')
        .append('<p class="post__text">' + postObj.text + '</p>')
        .append('<button id="post__edit">Edit</button><button id="post__remove">Remove</button>');

      $('.posts__container').prepend($postHtml);
      
    },
    clickListeners: function() {
      //click #post__add
      blog.buttons.add.click(function() {
        $('.create-post__form').show();
        $('.new__title').focus();
        $(this).hide()
      });

      //Click #post__create
      blog.buttons.create.click(function(e) {
        e.preventDefault();
        
        var newPostObj = {};

        newPostObj.title = $('.new__title').val();
        newPostObj.text = $('.new__text').val();

        // newPostObj.timestamp = new Date().toISOString();
        blog.createPost(newPostObj);
        $('.create-post__form').hide();
        blog.buttons.add.show();
        $('input[type="text"]').val('');
      });

      //Click #post__edit
      $('body').on('click', '#post__edit', function() {
        // $(this).parent.data('id');
        $('#post__edit, #post__remove').hide();
        $(this).parent().append('<form class="edit-post__form"><input type="text" placeholder="New Title" class="update__title"><input type="text" placeholder="New Text" class="update__text"><button id="post__update">Update Post</button></form>');

      });

      $('body').on('click', '#post__update', function(e) {
        e.preventDefault();
        var updatePostObj = {};

        updatePostObj.title = $('.update__title').val();
        updatePostObj.text = $('.update__text').val();
        updatePostObj.id = $(this).parent().parent().data('id');
        $('.edit-post__form').remove();
        $('#post__edit, #post__remove').show();
        blog.editPost(updatePostObj);
      });

      //Click #post__remove
      $('body').on('click','#post__remove', function() {
        blog.deletePost($(this).parent().data('id'));
        $(this).parent().remove();
      });
    }

  };

blog.init();
});
