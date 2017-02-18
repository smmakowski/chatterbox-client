// Set up page on load
$(document).ready(function() {
  console.log('Init firing.');
  app.init();
});


/// App ///


var app = {

  init: function() {

    $('#chats').on('click', '.username', function() {
      app.handleUsernameClick();
    });

    $('#send').unbind('submit').bind('submit').submit(function(event) {
      event.preventDefault();
      app.handleSubmit();
    });

    setInterval(function() {
      app.fetch('http://parse.sfm6.hackreactor.com/chatterbox/classes/messages');
    }, 5000);

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
        app.clearMessages();
        data.results.forEach(function(messageObj) {
          app.renderMessage(messageObj);
        });
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
    $('#chats').prepend($message);

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
  }


};


