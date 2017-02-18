var app = {

  init: function() {
    $(document).ready(function() {

      $('#chats').on('click', '.username', function() {
        app.handleUsernameClick();
      });

      $('#send .submit').on('submit', function(event) {
        event.preventdefault();
        app.handleSubmit();
      });
    });

    setInterval(function() {
      app.fetch('http://parse.sfm6.hackreactor.com/chatterbox/classes/messages');
    }, 1000);

  },

  send: function(message) { 
    $.ajax({
      url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },  

  fetch: function(url) {
    $.ajax({
      url: url,
      type: 'GET',
      // data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Reply received');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get message', data);
      }
    });
  },

  clearMessages: function() {
    $('#chats').children().remove();
  },

  renderMessage: function (message) {
    var $message = $('<div></div>');
    var $username = $('<span></span>').addClass('username').addClass(message.username).text(message.username);
    var $text = $('<p></p>').text(message.text);
    $message.prepend($username).append($text);
    $message.addClass('chat');
    $('#chats').append($message);

    // this.send(message);
  },

  renderRoom: function(roomName) {
    var $room = $('<option></option>');
    $room.attr('value', roomName).text(roomName);
    $('#roomSelect').append($room);
  },

  handleUsernameClick: function() {
    $('.username').addClass('friend');
  },

  handleSubmit: function() {
    // var username = ?????????; 
    //     var text = $('.messageField').val();
    //     var roomname = ???;

    //     var messageObj = {
    //       'username': ??,
    //       'text': text,
    //       'roomname': ??
    //     }
    //     app.send(messageObj);
  }


};


