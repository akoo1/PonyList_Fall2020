import React from 'react';

export default function UserCredentials(props) {
    /*
        bindPassword={pwd => setPassword(pwd)}
        bindConfirm={conf => setConfirm(conf)}
        bindUsername={usr => setUsername(usr)}
    */

    function handleUsernameChange(username) {
        props.bindUsername(username);
    }
    function handlePasswordChange(password) {
        props.bindPassword(password);
    }
    function handleConfirmChange(confirm) {
        props.bindConfirm(confirm);
    }
    return (
        <div className='d-flex flex-column justify-content-center align-items-center p-2'>
            <label className='align-self-start' htmlFor='reg-username'>
                Username
            </label>
            <input
                onChange={e => handleUsernameChange(e.target.value)}
                value={props.username}
                className='form-control-lg w-100 mt-2 mb-3'
                type='text'
                required
                name='reg-username'
                id='reg-username'
            />
            <label className='align-self-start' htmlFor='reg-password'>
                Password
            </label>
            <input
                className='form-control-lg w-100 mb-2'
                required
                onChange={e => handlePasswordChange(e.target.value)}
                value={props.password}
                type='password'
                name='reg-password'
                id='reg-password'
            />
            {props.register && (
                <>
                    <label className='align-self-start' htmlFor='reg-password'>
                        Confirm Password
                    </label>
                    <input
                        onChange={e => handleConfirmChange(e.target.value)}
                        value={props.confirm}
                        className='form-control-lg w-100 mb-2'
                        required
                        type='password'
                        name='confirm-password'
                        id='confirm-password'
                    />
                </>
            )}
        </div>
    );
}
