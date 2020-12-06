import React from 'react';
import {
    BrowserRouter as Router,
    Link,
    Route,
    useParams,
} from 'react-router-dom';
import Home from '../Home';
import DetailNav from '../layout/DetailNav';

const ManageItems = () => {
    const { userId } = useParams();
    return (
        <>
            <div className='container mt-4'>
                <DetailNav />
                <h3 className='mx-auto display-3 text-center'>
                    {' '}
                    Manage Your Items
                </h3>
                <div className='row mx-auto mt-5'>
                    <Link
                        className='col-3 btn btn-primary mx-auto'
                        to={`/manageItems/${userId}/pastSales`}
                    >
                        {' '}
                        Previous Sales{' '}
                    </Link>
                    <Link
                        className='col-3 btn btn-primary mx-auto'
                        to={`/sellItems/${userId}`}
                    >
                        {' '}
                        Post a new item!{' '}
                    </Link>
                    <Link
                        className='col-3 btn btn-primary mx-auto'
                        to={`/manageItems/${userId}/currentSales`}
                    >
                        {' '}
                        Current Items on Sale
                    </Link>
                </div>
            </div>
        </>
    );
};
export default ManageItems;
