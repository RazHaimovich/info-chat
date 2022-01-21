import React, { useState, useEffect } from 'react';
import emoji from 'node-emoji';
import './TypingArea.scss';
import { socket } from '../../../App';
import PACKETS from '../../PACKETS';

function TypingArea() {
    const [typingUsers, setTypingUsers] = useState([]);

    const startTypingHandler = (user) => {
        setTypingUsers(prevTypingUsers => {
            const index = prevTypingUsers.findIndex(prevTypingUsers => prevTypingUsers.id === user.id);
            if (index === -1) return [...prevTypingUsers, user];
            return [...prevTypingUsers];
        });
    }

    const stopTypingHandler = (user) => {
        setTypingUsers(prevTypingUsers => {
            const newTypingUsers = [...prevTypingUsers];
            const index = newTypingUsers.findIndex(newTypingUser => newTypingUser.id === user.id);
            if (index > -1) newTypingUsers.splice(index, 1);
            return [...newTypingUsers];
        });
    }

    useEffect(() => {
        socket.on(PACKETS.TYPING, startTypingHandler);
        socket.on(PACKETS.STOP_TYPING, stopTypingHandler);
    }, []);
    return (
        <span className="typing-area">
            {(typingUsers.length > 0) && emoji.emojify(":pencil2:" + typingUsers[0].username + " is typing...")}
        </span>
    );
}

export default TypingArea;