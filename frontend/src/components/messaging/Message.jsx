import React from 'react';
import './Message.css';

export const Message = ({ message: { user, text }, name, username }) => {
    let isSentByCurrentUser = false;
    let isImage = false;
    const trimmedName = name.trim().toLowerCase();

    if (user === trimmedName) {
        isSentByCurrentUser = true;
    }

    if (text.match(/(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/)) {
        isImage = true;
    }

    return isSentByCurrentUser ? (
        <div className='messageContainer justifyEnd'>
            <p className='sentText pr-3'>You</p>
            <div className='messageBox backgroundBlue'>
                {isImage ? (
                    <a target='_blank' href={text}>
                        <img width='150' height='100' src={text} alt={text} />
                    </a>
                ) : (
                    <p className='messageText'>{text}</p>
                )}
            </div>
        </div>
    ) : (
        <div className='messageContainer justifyStart'>
            <div className='messageBox backgroundLight'>
                {isImage ? (
                    <a target='_blank' href={text}>
                        <img width='150' height='100' src={text} alt={text} />
                    </a>
                ) : (
                    <p className='messageText colorDark'>{text}</p>
                )}
            </div>
            <p className='sentText pl-3'>{username}</p>
        </div>
    );
};
