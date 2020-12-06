import React from 'react';
import { Link } from 'react-router-dom';

import Rating from './Rating';
import './SellerInfo.css';

class SellerInfo extends React.Component {
    render() {
        return (
            <div className='seller-info-box'>
                <img
                    className='cover'
                    src={this.props.seller.ProfilePicture}
                    alt='seller-photo'
                />
                <div className='seller-info-details-box'>
                    <p className='seller-text-box'>
                        <b>Seller:</b>{' '}
                        {parseInt(window.localStorage.getItem('id')) !==
                        this.props.seller.UserID
                            ? this.props.seller.Username
                            : 'You'}
                    </p>
                    <div className='rating-box'>
                        <p className='rating-text'>
                            <b>Rating:</b>{' '}
                            <Rating
                                value={this.props.product.Rating}
                                class='stars-box-sellerInfo'
                            />
                        </p>
                    </div>
                    <p>
                        <b>On campus: </b>
                        {this.props.seller.OnCampus}
                    </p>
                    <p>
                        <b>Items sold: </b>
                        {this.props.seller.NumSales}
                    </p>
                    <Link
                        to={`/profile/${this.props.seller.UserID}`}
                        className='btn btn-info btn-sm'
                    >
                        {parseInt(window.localStorage.getItem('id')) !==
                        this.props.seller.UserID
                            ? 'Seller Profile'
                            : 'Your Profile'}
                    </Link>
                </div>
            </div>
        );
    }
}

export default SellerInfo;
