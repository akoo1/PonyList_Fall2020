import React from 'react';

export default function UserOptions(props) {
    function handleOnChangeStudent(e) {
        props.handleIsStudent(e.target.value);
    }
    function handleOnChangeCampus(e) {
        console.log(props);
        props.handleIsOnCampus(e.target.value);
    }

    function handleOnChangeDorm(e) {
        props.handleDorm(e.target.value);
    }
    function handleOnChangeLocation(e) {
        console.log(e.target.value);
        props.handleLocation(e.target.value);
    }
    return (
        <div className='text-center d-flex flex-column justify-content-center align-items-center p-2'>
            <label className='text-center d-block'>
                Are you an SMU student?
                <br />
                <input
                    type='checkbox'
                    value={props.isStudent}
                    onChange={handleOnChangeStudent}
                    name='isStudent'
                    id='isStudent'
                />{' '}
                YES!
            </label>
            <label className='text-center' htmlFor='isOnCampus'>
                Are you Living on Campus?
                <br />
                <input
                    type='checkbox'
                    name='isOnCampus'
                    id='isOnCampus'
                    value={props.isOnCampus}
                    onChange={handleOnChangeCampus}
                />{' '}
                YES!{' '}
            </label>
            <label className='d-block' htmlFor='dorm'>
                {' '}
                Housing/Dorm
            </label>
            <select
                disabled={!props.isOnCampus}
                onChange={handleOnChangeDorm}
                value={props.dorm}
                name='dorm'
                id='dorm'
            >
                <option value=''></option>
                <option value='Armstrong'>Armstrong</option>
                <option value='Boaz'>Boaz</option>
                <option value='Cockrell-McIntosh'>Cockrell-McIntosh</option>
                <option value='Kathy-Crow'>Kathy Crow</option>
                <option value='Crum'>Crum</option>
                <option value='Lloyd'>Lloyd</option>
                <option value='MHPS'>MHPS</option>
                <option value='McElvaney'>McElvaney</option>
                <option value='Morrison-McGinnis'>Morrison-McGinnis</option>
                <option value='Virginia Snider'>Virginia Snider</option>
                <option value='Ware'>Ware</option>
                <option value='Upper'>Upper Division Housing</option>
                <option value='other'>Other</option>
            </select>
            <label htmlFor='location'>Location</label>
            <input
                type='text'
                value={props.location}
                onChange={handleOnChangeLocation}
                name='location'
                id='location'
            />
        </div>
    );
}
