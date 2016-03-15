$(function() {
  var blog = {
    ENDPOINT: '/v1/posts/',
    local_mode: true,
    buttons: {
      add: document.getElementById('post__add'),
      create: document.getElementById('post__create')
    },
    postContainer: document.querySelector('.posts__container'),
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
          blog.postContainer.insertBefore(blog.createPostHtml(el), blog.postContainer.firstChild);
        });
      }
      $.ajax({
        url: blog.ENDPOINT,
        method: 'GET',
        success: function(posts) {
          posts.forEach(function(el, i, arr) {
            blog.postContainer.insertBefore(blog.createPostHtml(el), blog.postContainer.firstChild);
          });
        }
      });
    },
    createPost: function(postObj) {
      if(blog.local_mode){
        postObj.timestamp = new Date().toISOString();
        //assuming the server creates id this just makes a random number for local testing
        postObj.id = Math.floor(Math.random() * 1000);
        blog.localPosts.push(postObj);
        blog.postContainer.insertBefore(blog.createPostHtml(postObj), blog.postContainer.firstChild);
      }

      $.ajax({
        url: blog.ENDPOINT,
        method: 'POST',
        data: postObj,
        success: function(createdPost) {
          //assume here that response would be the full post object with ID and timestamp
          blog.postContainer.insertBefore(blog.createPostHtml(createdPost), blog.postContainer.firstChild);
        }
      });
    },
    editPost: function(updatePostObj) {
      if (blog.local_mode) {
        document.querySelector('.post__item[data-id="' + updatePostObj.id + '"] h2').innerHTML = updatePostObj.title;
        document.querySelector('.post__item[data-id="'+ updatePostObj.id+'"] p').innerHTML = updatePostObj.text;
      }
      $.ajax({
        url: blog.ENDPOINT + updatePostObj.id,
        method: 'POST',
        data: {"title": updatePostObj.title, "text": updatePostObj.text},
        success: function(response) {
          document.querySelector('.post__item[data-id="' + updatePostObj.id + '"] h2').innerHTML = response.title;
          document.querySelector('.post__item[data-id="'+ updatePostObj.id+'"] p').innerHTML = response.text;
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
      
      var postHtml = document.createElement('div');
      var postHeading = document.createElement('h2');
      var postDate = document.createElement('div');
      var editButton = document.createElement('button');
      var removeButton = document.createElement('button');
      var postText = document.createElement('p');

      postHtml.className += 'post__item';
      postHtml.setAttribute('data-id', postObj.id);
      
      postHeading.className += 'post__title';
      postHeading.appendChild(document.createTextNode(postObj.title));
      postHtml.appendChild(postHeading);

      postDate.className += 'post__date';
      postDate.appendChild(document.createTextNode(postObj.timestamp));
      postHtml.appendChild(postDate);

      postText.className += 'post__text';
      postText.appendChild(document.createTextNode(postObj.text));
      postHtml.appendChild(postText);

      editButton.id = 'post__edit';
      editButton.appendChild(document.createTextNode('Edit'));
      postHtml.appendChild(editButton);

      removeButton.id = 'post__remove';
      removeButton.appendChild(document.createTextNode('Remove'));
      postHtml.appendChild(removeButton);

      return postHtml;
    },

    clickListeners: function() {
      var body = document.getElementsByTagName('body')[0];
      //click #post__add
      blog.buttons.add.addEventListener('click', function() {
        document.getElementsByClassName('create-post__form')[0].style.display = 'block'
        // $('.new__title').focus();
        this.style.display = 'none';
      });

      //Click #post__create
      blog.buttons.create.addEventListener('click', function(e) {
        e.preventDefault();

        var newPostObj = {};
        
        newPostObj.title = document.getElementsByClassName('new__title')[0].value;

        newPostObj.text = document.getElementsByClassName('new__text')[0].value;

        // newPostObj.timestamp = new Date().toISOString();
        blog.createPost(newPostObj);
        document.getElementsByClassName('create-post__form')[0].style.display = 'none';
        blog.buttons.add.style.display = 'block';
        document.getElementsByClassName('create-post__form')[0].reset();
      });

      //Click #post__edit
      body.addEventListener('click', function(e) {

        if (e.target.id.toLowerCase() === 'post__edit') {
          document.querySelector('#post__edit').style.display = 'none';
          document.querySelector('#post__remove').style.display = 'none';

          var editForm = document.createElement('form');
          var titleField = document.createElement('input');
          var textField = document.createElement('input');
          var updateButton = document.createElement('button');

          editForm.className += 'edit-post__form';
          
          titleField.type = 'text';
          titleField.setAttribute('placeholder', 'New Title');
          titleField.className += 'update__title';

          editForm.appendChild(titleField);
          
          textField.type = 'text';
          textField.setAttribute('placeholder', 'New Text');
          textField.className += 'update__text';
          
          editForm.appendChild(textField);
          
          updateButton.appendChild(document.createTextNode('Update Post'));
          updateButton.id = 'post__update';
          editForm.appendChild(updateButton);

          e.target.parentNode.appendChild(editForm);
        }
      });
      
     // click #post__update
     body.addEventListener('click', function(e) {
        e.preventDefault();
        if (e.target.id.toLowerCase() ===  'post__update') {
          var updatePostObj = {};
          
          updatePostObj.title = document.getElementsByClassName('update__title')[0].value;
          updatePostObj.text = document.getElementsByClassName('update__text')[0].value;

          updatePostObj.id = e.target.parentNode.parentNode.getAttribute('data-id');

          document.getElementsByClassName('edit-post__form')[0].outerHTML = '';

          document.querySelector('#post__edit').style.display = 'initial';
          document.querySelector('#post__remove').style.display = 'initial';

          blog.editPost(updatePostObj);
        }
      });
      //Click #post__remove
      body.addEventListener('click', function(e) {
        if (e.target.id.toLowerCase() === 'post__remove') {
          blog.deletePost(e.target.parentNode.parentNode.getAttribute('data-id'));
          e.target.parentNode.outerHTML = '';
        }
      });
    }
  };
blog.init();
});
