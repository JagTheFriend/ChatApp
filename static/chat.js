const socket = io.connect('http://' + document.domain + ':' + location.port + '/chat');
// gets the username
var USERNAME;
// gets the name of the room
var ROOM;

socket.on('connect', function () {
    // gets the username
    const USERNAME = document.getElementById("room").innerHTML.split(" ").slice(-1);
    // gets the name of the room
    const ROOM = document.getElementById("room").innerHTML.split(" ").slice(-2)[0];

    socket.emit('join_room', {
        username: USERNAME,
        room: ROOM
    });
    let message_input = document.getElementById('message_input');
    document.getElementById('message_input_form').onsubmit = function (e) {
        e.preventDefault();
        let message = message_input.value.trim();
        if (message.length) {
            socket.emit('send_message', {
                username: USERNAME,
                room: ROOM,
                message: message
            })
        }
        message_input.value = '';
        message_input.focus();
    }
});
window.onbeforeunload = function () {
    socket.emit('leave_room', {
        username: USERNAME,
        room: ROOM
    })
};
socket.on('receive_message', function (data) {
    console.log(data);
    const newNode = document.createElement('div');
    newNode.innerHTML = `<b>${data.username}:&nbsp;</b> ${data.message}`;
    document.getElementById('messages').appendChild(newNode);
});
socket.on('join_room_announcement', function (data) {
    console.log(data);
    if (data.username !== USERNAME) {
        const newNode = document.createElement('div');
        newNode.innerHTML = `<b>${data.username}</b> has joined the room`;
        document.getElementById('messages').appendChild(newNode);
    }
});
socket.on('leave_room_announcement', function (data) {
    console.log(data);
    const newNode = document.createElement('div');
    newNode.innerHTML = `<b>${data.username}</b> has left the room`;
    document.getElementById('messages').appendChild(newNode);
});
