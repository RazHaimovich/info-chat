import React, { useState, useEffect } from 'react';
import { socket } from '../../App';
import PACKETS from '../PACKETS';
import './TopBar.scss';


function TopBar() {
    const [username, setUsername] = useState("");
    const [usersCount, setUsersCount] = useState(0);

    useEffect(() => {
        socket.on(PACKETS.SEND_USER_DATA, user => setUsername(user.username));
        socket.on(PACKETS.NEW_USER_JOIN, () => setUsersCount(prevCount => prevCount + 1));
        socket.on(PACKETS.USER_LEFT, () => setUsersCount(prevCount => prevCount - 1));
        socket.on(PACKETS.UPDATE_USERS_LIST, users => setUsersCount(users.length));
    }, []);

    return (
        <div className='topbar'>
            <span>Hello <strong>{username}</strong>!</span>
            <span>Online Users: <strong>{usersCount}</strong></span >
        </div >
    );
}

export default TopBar;