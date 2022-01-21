import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import PACKETS from '../PACKETS';
import { socket } from '../../App';
import './InputArea.scss'

function InputArea() {
    const [isTyping, setIsTyping] = useState(false);
    const [inputContent, setInputContent] = useState("");

    const sendMessage = () => {
        if (inputContent.trim().length > 0) {
            socket.emit(PACKETS.SEND_MESSAGE, inputContent);
            setInputContent("");
            setIsTyping(false);
            socket.emit(PACKETS.STOP_TYPING);
        }
    }

    const onKeyDown = e => {
        const trimmedValue = e.target.value.trim();
        if (e.key === 'Enter' && !e.shiftKey && trimmedValue.length > 0) {
            sendMessage();
            e.preventDefault();
        } else if (trimmedValue.length > 0 && !isTyping) {
            setIsTyping(true);
            socket.emit(PACKETS.TYPING);
        } else if (trimmedValue.length === 0 && isTyping) {
            setIsTyping(false);
            socket.emit(PACKETS.STOP_TYPING);
        }
    }

    return (
        <form className='input-area'>
            <TextareaAutosize maxRows={3} autoFocus onKeyDown={onKeyDown} onChange={e => setInputContent(e.target.value)} value={inputContent} />
            <button onClick={sendMessage} type="button"><i className="fas fa-share"></i></button>
        </form>
    );
}

export default InputArea;