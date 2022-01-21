import React from 'react';
import emoji from 'node-emoji';
import { format } from '@flasd/whatsapp-formatting';
import htmlspecialchars from 'htmlspecialchars';
import './Message.scss';

function Message({ content, currentUser }) {
    const date = new Date(content.time);
    const fixZero = (num) => num < 10 ? "0" + num : num;
    const getTime = (date) => fixZero(date.getHours()) + ":" + fixZero(date.getMinutes())
    const removeDuplicateLines = (msg) => {
        const lines = msg.split("\n");
        const filterdLines = lines.filter(line => line.trim().length > 0);
        return filterdLines.join("\n");
    }
    return (
        <div className={currentUser ? "message current-user" : "message"}>
            <div className='info'>
                <span className="writer">{emoji.emojify(content.user.username)}</span>
                <span className="time">{getTime(date)}</span>
            </div>
            <span className="content" dangerouslySetInnerHTML={{ __html: format(emoji.emojify(htmlspecialchars(removeDuplicateLines(content.content)))) }}></span>
        </ div >
    );
}


export default Message;