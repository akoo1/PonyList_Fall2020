import React from 'react';
import './InfoBar.css';
import closeIcon from '../../icons/closeIcon.png';
import onlineIcon from '../../icons/onlineIcon.png';
import { Link } from 'react-router-dom';

export const InfoBar = props => {
    return (
        <div className='infoBar'>
            <div className='leftInnerContainer'>
                <img
                    className='onlineIcon'
                    src={onlineIcon}
                    alt='online image'
                />
                <h3>{props.username}</h3>
            </div>
            <div className='rightInnerContainer'>
                <a href='/chat'>
                    <img src={closeIcon} alt='close' />
                </a>
            </div>
        </div>
    );
};
