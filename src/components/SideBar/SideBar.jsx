import React, { useState, useEffect } from 'react';
import emoji from 'node-emoji';
import PACKETS from '../PACKETS';
import { socket } from '../../App';
import Logo from './Logo/Logo';
import ProfilePictures from './ProfilePictures/ProfilePictures'
import './SideBar.scss';


function SideBar() {
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [users, setUsers] = useState([]);

    const userLeftHandler = (user) => {
        setUsers(prevUsers => {
            const usersList = [...prevUsers];
            return usersList.filter(userLeft => userLeft.id !== user.id);
        });
    }

    useEffect(() => {
        socket.on(PACKETS.SEND_USER_DATA, user => setLoggedInUserId(user.id));
        socket.on(PACKETS.NEW_USER_JOIN, user => setUsers(prevUsers => [...prevUsers, user]));
        socket.on(PACKETS.USER_LEFT, userLeftHandler);
        socket.on(PACKETS.UPDATE_USERS_LIST, users => setUsers(users));
    }, []);

    return (
        <div className='SideBar'>
            <div className='shelf online-users'>
                <div className='title'>Online Users ({users.length})</div>
                <div className='content'>
                    <ul>
                        {users.map(user => <li key={user.id} className={(user.id === loggedInUserId) ? "currentUser" : ""}>
                            <ProfilePictures id={user.profilePicture} />
                            <div className='username'>{emoji.emojify(user.username)}</div>
                        </li>)}
                    </ul>
                </div>
            </div>
            <Logo />
        </div>
    );
}

export default SideBar;