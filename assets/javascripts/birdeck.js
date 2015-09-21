$(document).ready(function() {
  fetchPosts();
  createPost();
  fetchPostsButton();
  deletePost();
});

function fetchPosts() {
  var newestPostId = parseInt($('.post').last().attr('data-id'));

  $.ajax({
    type: 'GET',
    url:  'https://turing-birdie.herokuapp.com/api/v1/posts.json',
    success: function(posts) {
      $.each(posts, function(index, post) {
        if (isNaN(newestPostId) || post.id > newestPostId) {
          renderPost(post);
        }
      });
    }
  });
};

function createPost() {
  $('#create-post').on('click', function() {
    var postParams = {
      post: {
        description: $('#post-description').val()
      }
    };

    $.ajax({
      type: 'POST',
      url:  'https://turing-birdie.herokuapp.com/api/v1/posts.json',
      data: postParams,
      success: function(post) {
        renderPost(post);
      }
    });
  });
};

function renderPost(post) {
  $('#latest-posts').append(
    '<div class="post" data-id="'
    + post.id
    + '"><h6>Published on '
    + post.created_at
    + '</h6><p>'
    + post.description
    + '</p><button class="delete-post btn btn-default btn-xs">Delete</button></div>'
    );
};

function fetchPostsButton() {
  $('#button-fetch').on('click', function() {
    fetchPosts();
  });
};

function deletePost() {
  // Must use delegate because delete button may not exist yet.
  $('#latest-posts').delegate('.delete-post', 'click', function() {
    var $post = $(this).closest('.post');

    $.ajax({
      type: 'DELETE',
      url: 'https://turing-birdie.herokuapp.com/api/v1/posts/'
        + $post.attr('data-id')
        + '.json',
      success: function() {
        $post.remove();
      },
      error: function() {
        // Assuming post was already removed by another request
        $post.remove();
      }
    });
  });
};
