import React from 'react';
import Conversation from '../Conversation/Conversation';
import SideBar from '../SideBar/SideBar';
import TopBar from '../TopBar/TopBar';
import InputArea from '../InputArea/InputArea';
import './Chat.scss';


function Chat() {
    return (
        <div className='chat'>
            <TopBar />
            <SideBar />
            <Conversation />
            <InputArea />
        </div >
    );
}

export default Chat;