// Set up page on load
$(document).ready(function() {
  console.log('Init firing.');
  window.username = window.location.search.split('=')[1];
  app.init();
});


/// App ///


var app = {


  init: function() {

    // set friend on click
    $('#chats').on('click', '.username', function() {
      app.handleUsernameClick();
    });

    // set current room
    $('#roomSelect').change(function() {
      var $clickedRoom = $(this).val();
      if ($clickedRoom === 'newRoom') {
        var roomName = prompt('Name your room.');
        app.renderRoom(roomName);
      } else {
        $('#chats').children().hide();
        app.currentRoom = $clickedRoom;
        var roomProperty = '.' + $clickedRoom;
        $(roomProperty).show();
      }
    });

    // clear messages with button click
    $('#clear').on('click', function() {
      app.clearMessages();
    });

    // send message event
    $('#send').unbind('submit').bind('submit').submit(function(event) {
      event.preventDefault();
      app.handleSubmit();
    });

    // fetch new messages
    // setInterval(function() {
    //   app.fetch('http://parse.sfm6.hackreactor.com/chatterbox/classes/messages');
    // }, 1000);
    app.fetch('http://parse.sfm6.hackreactor.com/chatterbox/classes/messages');
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
    if (url) {
      url += '?limit=1000&order=createdAt';
    }
    $.ajax({
      url: url,
      type: 'GET',
      contentType: 'application/json',
      // dataType: 'json',
      success: function (data) {
        app.clearMessages();
        data.results.forEach(function(messageObj) {
          app.renderMessage(messageObj);
        });
        // console.log('chatterbox: Reply received');
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
    var $message = $('<div></div>').addClass(message.roomname);
    var $username = $('<span></span>')
    .addClass('username')
    .addClass(message.username)
    .text(message.username);

    var $text = $('<p></p>').text(message.text);
    $message.prepend($username).append($text);
    $message.addClass('chat');
    $('#chats').prepend($message);
  },

  renderRoom: function(roomName) {
    var $room = $('<option></option>');
    $room.attr('value', roomName).text(roomName);
    $('#roomSelect').prepend($room);
  },

  handleUsernameClick: function() {
    $('.username').addClass('friend');
  },

  handleSubmit: function() {
    var text = $('#message').val();
    var username = window.username;
    var message = {
      'username': username,
      'text': text,
      'roomname': app.currentRoom
    };

    app.renderMessage(message);
    app.send(message);
  },

  currentRoom: 'lobby'

};




