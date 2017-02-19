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
      var username = '.' + $(this).attr('class').split(' ')[1];

      // if we arent friends yet, make them friends
      if (app.friends.indexOf(username) === -1) {
        app.friends.push(username);
      }
      app.handleUsernameClick(username);
    });



    // set current room
    $('#roomSelect').change(function() {
      // if new room is clicked, generate new room
      var $clickedRoom = $(this).val();
      if ($clickedRoom === 'Create new Room here...') { 
        var roomName = prompt('Name your room.');
        app.renderRoom(roomName);
      } else {
        // otherwise filter messages by newly clicked room
        $('#chats').children().hide();
        app.currentRoom = $clickedRoom;
        var roomProperty = '.' + $clickedRoom;
        $(roomProperty).show();
        $('.currentRoom').text(app.currentRoom);
      }
    });



    // refresh rooms on roomList click
    $('#roomSelect').click(function() {
      // $('#roomSelect').children().remove();
      app.roomList.forEach(function(roomname) {
        app.renderRoom(roomname);
      });
      app.renderRoom('Create new Room here...');
    });



    // clear messages with button click
    $('#clear').on('click', function() {
      app.clearMessages();
    });



    // send message event
    $('#send').unbind('submit').bind('submit').submit(function(event) {
      event.preventDefault();
      app.handleSubmit();
      $('#message').val('');
    });



    // fetch new messages every x seconds
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
      contentType: 'application/json',
      data: 'order=-createdAt',
      success: function (data) {
        app.clearMessages();
        data.results.forEach(function(messageObj) {

          // generate every new message for current room only
          if (app.currentRoom === messageObj.roomname) {
            app.renderMessage(messageObj);
          }

          // check if any new rooms have been created since last fetch, if so. Add them to roomList
          if (!app.roomList.includes(messageObj.roomname)) {
            app.roomList.push(messageObj.roomname);
          }
        });
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
    .text(app.secure(message.username));
    // if new message is by user in friends list, add friend class
    if (app.friends.includes('.' + message.username)) {
      $username.addClass('friend');
    }
    var $text = $('<p></p>').text(app.secure(message.text));
    $message.prepend($username).append($text);
    $message.addClass('chat');
    $('#chats').append($message);
  },



  renderRoom: function(roomName) {
    var $room = $('<option></option>');
    $room.attr('value', roomName).text(roomName);
    $('#roomSelect').append($room);
  },



  handleUsernameClick: function(username) {
    $(username).toggleClass('friend');
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
  


  //Security Function
  secure: function(string) {
    if (!string) { return ''; }
    var forbidden = ['<', '>', '/', '{', '}', ';', '[', ']', '(', ')', '%', '$'];
    var secured = string.split('');
    for (var i = 0; i < secured.length; i++) {
      if (forbidden.indexOf(secured[i]) > -1) {
        secured[i] = ' ';
      }
    }
    return secured.join('');
  },



  // how we keep track of current room for message posting
  currentRoom: 'lobby',



  // list of rooms that updates as we GET data from server
  roomList: [],



  // stores our friends list to highlight friend names on message arrival
  friends: [],

};




