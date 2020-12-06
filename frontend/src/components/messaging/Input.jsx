import React from 'react';

import './Input.css';

export const Input = ({ message, setMessage, sendMessage }) => {
  return (
    <div>
      <form className='form'>
        <input
          placeholder='Type a message'
          type='text'
          className='input'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => (e.key === 'Enter' ? sendMessage(e) : null)}
        />
        <button className='sendButton' onClick={(e) => sendMessage(e)}>
          Send
        </button>
      </form>
    </div>
  );
};
