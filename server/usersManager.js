const PACKETS = require('./PACKETS');
const botManager = require('./botManager');

function usersManager(io) {
    const PROFILE_PUCTURE_COUNT = 9;
    const users = [{ id: 0, username: "OwlBot:owl:", profilePicture: 0 }];
    let last_user_id = 0;
    let last_user_message_id = 0;
    const bot = new botManager(users[0], io);

    const userJoinHandler = (socket) => {
        //Create User
        const username = "guest" + ++last_user_id;
        const user = { id: last_user_id, username, profilePicture: Math.floor(Math.random() * PROFILE_PUCTURE_COUNT) + 1 };
        //Update the clients
        socket.emit(PACKETS.SEND_USER_DATA, user);
        socket.broadcast.emit(PACKETS.NEW_USER_JOIN, user);
        socket.emit(PACKETS.UPDATE_USERS_LIST, [user, ...users]);
        //Update the server
        console.log(username + " joined!");
        users.push(user);
        bot.userJoin(user, socket);
        //Add listeners
        socket.on('disconnect', () => { userDisconnectHandler(user) });
        socket.on(PACKETS.SEND_MESSAGE, message => { onMessageHandler(socket, user, message); });
        socket.on(PACKETS.TYPING, message => { userTypingHandler(socket, user); });
        socket.on(PACKETS.STOP_TYPING, message => { userStopTypingHandler(socket, user); });
    }

    const userDisconnectHandler = (user) => {
        const index = users.findIndex(u => u.id === user.id);
        console.log(user.username + " left!");
        io.emit(PACKETS.USER_LEFT, user);
        io.emit(PACKETS.STOP_TYPING, user);
        users.splice(index, 1);
    }

    const onMessageHandler = (socket, user, message) => {
        //Create Message Object
        const trimmedMessage = message.trim();
        const messageObj = { user, id: ++last_user_message_id, content: trimmedMessage, time: new Date().getTime() };
        //Detect if command or regular message
        const firstCharacther = trimmedMessage[0];
        if (firstCharacther === '/') {
            //Command
            bot.commandSent(trimmedMessage, user, socket);
            socket.emit(PACKETS.SEND_MESSAGE, messageObj);
        } else {
            //regular message
            bot.messageSent(messageObj, user);
            io.emit(PACKETS.SEND_MESSAGE, messageObj);
            socket.broadcast.emit(PACKETS.STOP_TYPING, user);
        }
    }

    const userTypingHandler = (socket, user) => {
        socket.broadcast.emit(PACKETS.TYPING, user);
    }

    const userStopTypingHandler = (socket, user) => {
        socket.broadcast.emit(PACKETS.STOP_TYPING, user);
    }

    io.on('connection', userJoinHandler);
}
module.exports = usersManager;