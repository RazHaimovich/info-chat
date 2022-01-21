import React, { useState, useEffect, useRef } from 'react';
import PACKETS from '../PACKETS';
import { socket } from '../../App';
import Message from './Message/Message';
import TypingArea from './TypingArea/TypingArea';
import './Conversation.scss';

function MessagesArea() {
    const messagesEndRef = useRef();
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [messages, setStateMessages] = useState([]);

    useEffect(() => {
        socket.on(PACKETS.SEND_USER_DATA, user => setLoggedInUserId(user.id));
        socket.on(PACKETS.SEND_MESSAGE, message => setStateMessages(prevMessages => [...prevMessages, message]));
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(() => scrollToBottom, [messages]);

    return (
        <div className='conversation'>
            <div className='messages'>
                {messages.map(message => (<Message key={message.id} content={message} currentUser={loggedInUserId === message.user.id} />))}
                <div ref={messagesEndRef} />
                <TypingArea />
            </div>
        </div>
    );
}

export default MessagesArea;