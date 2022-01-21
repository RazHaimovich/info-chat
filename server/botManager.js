const PACKETS = require('./PACKETS');
const oneLinerJoke = require('one-liner-joke');


const TYPING_TIME = 3;//The bot's typing time in seconds
const COMMAND_NOT_FOUND = "The Command not found!";
const WELCOME_MSG = "Hello {$username}:heart:!\nMy name is {$bot_name} and I`m here :four: You!\nFor help use the command: */help*";
const HELP_MSG = ":owl:*_HELP:_*\nIf you want to get a free joke ask from me!:stuck_out_tongue_closed_eyes:\nYou can make the text *bold* with *\nYou can make the text _italic_ with _\nTou can use :banana:emojis with :";

let bot_message_id_counter = 0;// id counter for bot messages
let hasNewQuestion = false;// detaect new question
let newQuestion = "";// remember last question

class botManager {
    constructor(user, io) {
        this.user = user;
        this.io = io;
    }

    userJoin(user, socket) {
        const msg = this.#name_replacer(WELCOME_MSG, user);
        this.#sendMessageToUser(msg, user, socket);
    }

    async messageSent(msg, user) {
        const content = msg.content.trim().toLowerCase().replace(/\?/, '');
        if (content === "tell me a joke") {//TELL A JOKE DETACTION
            this.#tell_joke();
        }
    }
    commandSent(command, user, socket) {
        const args = command.replace("/", "").split(" ");
        switch (args[0].toLowerCase()) {
            case 'help':
                this.#sendMessageToUser(HELP_MSG, user, socket);
                break;
            case 'telljoke':
            case 'joke':
                this.#tell_joke();
                break;
            case 'date':
            case 'time':
                const date = new Date().toLocaleString();
                this.#sendMessageToUser("The current time is:" + date, user, socket);
                break;
            default:
                this.#sendMessageToUser(COMMAND_NOT_FOUND, user, socket);
                break;
        }
    }

    #sendMessage(msg) {
        this.#startTyping();
        setTimeout(() => {
            this.io.emit(PACKETS.SEND_MESSAGE, { user: this.user, id: --bot_message_id_counter, content: msg, time: new Date().getTime() });
            this.#stopTyping();
        }, TYPING_TIME * 1000);
    }

    #sendMessageToUser(msg, user, socket) {
        this.#startTyping(socket);
        setTimeout((socket) => {
            socket.emit(PACKETS.SEND_MESSAGE, { user: this.user, id: --bot_message_id_counter, content: msg, time: new Date().getTime() });
            this.#stopTyping(socket);
        }, TYPING_TIME * 1000, socket);
    }

    #startTyping(socket = null) {
        if (!socket) {
            this.io.emit(PACKETS.TYPING, this.user);
        } else {
            socket.emit(PACKETS.TYPING, this.user);
        }
    }

    #stopTyping(socket = null) {
        if (!socket) {
            this.io.emit(PACKETS.STOP_TYPING, this.user);
        } else {
            socket.emit(PACKETS.STOP_TYPING, this.user);
        }
    }

    #name_replacer(msg, user) {
        msg = msg.replace("{$username}", user.username);
        msg = msg.replace("{$bot_name}", this.user.username);
        return msg.trim();
    }

    #tell_joke() {
        const joke = oneLinerJoke.getRandomJoke();
        this.#sendMessage(joke.body);
    }
}

module.exports = botManager;