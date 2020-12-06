import React from 'react';
import './Messages.css';
import ScrollToBottom from 'react-scroll-to-bottom';

import { Message } from './Message';

export const Messages = ({ messages, name, username }) => {
    return (
        <ScrollToBottom className='messages'>
            {messages.map((message, i) => {
                return (
                    <div key={i}>
                        <Message
                            username={username}
                            message={message}
                            name={name}
                        />
                    </div>
                );
            })}
        </ScrollToBottom>
    );
};
