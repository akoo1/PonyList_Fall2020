import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URL } from '../../api_url';
import DetailNav from '../layout/DetailNav';
export const Contacts = props => {
    Array.prototype.swap = function (x, y) {
        if (this[x] > this[y]) {
            let b = this[x];
            this[x] = this[y];
            this[y] = b;
        }
        return this;
    };
    const [contacts, setContacts] = useState([]);

    const fetchContacts = async () => {
        let contacts;
        await axios
            .get(`${API_URL}/contacts/${window.localStorage.getItem('id')}`)
            .then(res => {
                contacts = res.data;
            })
            .catch(err => {
                return err;
            });
        console.log(contacts);
        return contacts;
    };

    useEffect(() => {
        fetchContacts().then(res => setContacts(res));
    }, []);
    return (
        <div>
            <DetailNav />
            <h1 className='text-center display-4'>Recent Contacts</h1>
            <ul>
                {contacts.map(contact => {
                    return (
                        <li key={contact.RecipientID}>
                            <div className='text-center card p-3 mx-5'>
                                <Link
                                    onClick={props.toggleClosed}
                                    style={{ textDecoration: 'none' }}
                                    to={`/chat?name=${window.localStorage.getItem(
                                        'id'
                                    )}&room=${[
                                        `${window.localStorage.getItem('id')}`,
                                        '-',
                                        contact.RecipientID,
                                    ]
                                        .swap(0, 2)
                                        .join('')}`}
                                >
                                    {contact.Username}
                                </Link>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
