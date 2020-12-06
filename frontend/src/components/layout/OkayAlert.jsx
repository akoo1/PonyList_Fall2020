import React from 'react';
import './OkayAlert.css';

export const OkayAlert = ({ clicked, message }) => {
    const handleOkay = e => {
        clicked(true);
    };

    return (
        <div className='OkayAlert'>
            <h2 className='Message'>{message}</h2>
            <div className='Confirm-Buttons w-100 d-flex justify-content-center align-items-center'>
                <button onClick={handleOkay} className='mx-2 btn w-50'>
                    Okay
                </button>
            </div>
        </div>
    );
};

export default OkayAlert;
