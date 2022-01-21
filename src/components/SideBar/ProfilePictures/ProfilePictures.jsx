import React from 'react';
import bot from '../../../images/profilePictures/bot.jpg';
import './ProfilePictures.scss';

function ProfilePictures({ id }) {
    const BOT_PICTURE_ID = 0;
    return (
        <img src={id !== BOT_PICTURE_ID ? `https://randomuser.me/api/portraits/lego/${id}.jpg` : bot} alt='ProfilePicture' className='ProfilePictures' />
    );
}

export default ProfilePictures;