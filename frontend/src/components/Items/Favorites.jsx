import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_URL } from '../../api_url';
import DetailNav from '../layout/DetailNav';

const Favorites = () => {
    const { itemId } = useParams();
    const [users, setUsers] = useState([]);
    const [item, setItem] = useState({});
    useEffect(() => {
        console.log(itemId);
        axios.get(`${API_URL}/favoritedBy/${itemId}`).then(res => {
            setUsers(res.data);
            console.log(res);
            axios.get(`${API_URL}/item/${itemId}`).then(res => {
                console.log(res.data[0]);
                setItem(res.data[0]);
            });
        });
    }, []);
    return (
        <div className='ProfilePage container mt-4'>
            <DetailNav />
            <div className='d-flex justify-content-center align-items-center'>
                <img
                    width='150'
                    height='150'
                    src={item.ImageURL}
                    alt='Product Image'
                />
            </div>
            <h1 className='text-center'>Users interested in this item</h1>
            <table className='table table-striped my-5'>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user, index) => {
                            return (
                                <tr key={user.UserID}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <Link to={`/profile/${user.UserID}`}>
                                            {user.Username}
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <h2 className='text-center display-4'>
                            No user has favorited this item...
                        </h2>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Favorites;
