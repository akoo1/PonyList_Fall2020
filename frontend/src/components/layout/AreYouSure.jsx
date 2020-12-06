import React from 'react';
import './AreYouSure.css';

export const AreYouSure = ({ theyAreSure, message }) => {
    const handleYes = e => {
        theyAreSure(true);
    };
    const handleNo = e => {
        theyAreSure(false);
    };
    return (
        <div className='AreYouSure'>
            <h2 className='Message'>{message}</h2>
            <div className='Confirm-Buttons w-100 d-flex justify-content-center align-items-center'>
                <button onClick={handleYes} className='mx-2 btn w-50'>
                    Yes
                </button>
                <button onClick={handleNo} className='mx-2 btn w-50'>
                    No
                </button>
            </div>
        </div>
    );
};

export default AreYouSure;
