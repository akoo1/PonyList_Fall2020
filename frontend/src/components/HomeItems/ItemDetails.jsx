import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import shortid from 'shortid';

import './ItemDetails.css';
// import { UserReview } from '../../models/UserReview';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import SellerInfo from './SellerInfo';
// import { ItemsRepository } from '../api/ItemsRepository';
import DetailNav from '../layout/DetailNav';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Alert from '../layout/Alert';
import { API_URL } from '../../api_url';
import Loader from '../layout/Loader';



const ItemDetails = () => {

	const [item, setItem] = useState(null)
	const [seller, setSeller] = useState(null)
	const [sellerReviews, setSellerReviews] = useState(null)
	const [itemImages, setItemImages] = useState(null)
	const [currImageIndex, setCurrImageIndex] = useState(0)
	const [alertMessage, setAlertMessage] = useState('')
	const [alertKey, setAlertKey] = useState('')
	const [isFavorited, setIsFavorited] = useState(false)

	const { itemId } = useParams()
	const currUrl = window.location.href;

	// componentDidMount()
	useEffect(() => {
		// item and seller are both returned as a single object in an array)

		// get item => get seller & get sellerReviews
		axios.get(`${API_URL}/item/${itemId}`)
			.then(res => {
				let fetchedItem = res.data[0]
				setItem(fetchedItem)

				const sellerId = fetchedItem.SellerID;
				// get seller
				axios.get(`${API_URL}/user/${sellerId}`)
					.then(res => {
						let seller = res.data[0]
						setSeller(seller)
					})
				// get sellerReviews
				axios.get(`${API_URL}/reviews/${sellerId}`)
					.then(res => setSellerReviews(res.data))
			})

		// get itemImages
		axios.get(`${API_URL}/images/${itemId}`)
			.then(res => {
				setItemImages(res.data)
				// To add the "active" className to the initial active image
				const index = currImageIndex
				if (thumbsBoxRef.current) {
					thumbsBoxRef.current.children[index].className = 'active'
				}
			})

		axios.get(`${API_URL}/favoritedBy/${itemId}`)
			.then(res => {
				let likedByMe = res.data.filter(user =>
					user.UserID === parseInt(window.localStorage.getItem('id'))).length > 0;
				setIsFavorited(likedByMe)
			})

	}, [])





	const getId = () => {
		const id = shortid.generate();
		console.log(id);
		return id;
	}

	const addReviewHandler = (ReviewText, Rating) => {
		const newReview = {
			ItemID: item.ItemID,
			SellerID: item.SellerID,
			BuyerID: window.localStorage.getItem('id') || 1,
			ReviewText,
			Rating
		}
		axios.post(`${API_URL}/addReview`, newReview)
			.then(newReview => {
				let reviews = [...sellerReviews];
				reviews.push(newReview);
				setSellerReviews(reviews);
				alert('User review added!');
			})
		window.location.reload(); // this can be changed here... just temporary unless we run out of time.
	}


	const favoriteItemHandler = () => {
		let userId = window.localStorage.getItem('id');
		let itemId = item.ItemID;

		axios.post(`${API_URL}/addFavorite`, {
			UserID: userId,
			ItemID: itemId
		})
			.then(res => {
				console.log(res)
				setIsFavorited(true)
				setAlertKey(getId())
			})
			.catch(err => console.log(err));
	}


	const unfavoriteItemHandler = () => {
		let userId = window.localStorage.getItem('id');
		let itemId = item.ItemID;

		axios.delete(`${API_URL}/deleteFavorite/${userId}/${itemId}`, {
			UserID: userId,
			ItemID: itemId,
		})
			.then(res => {
				console.log('unfavorited item!');
				setIsFavorited(false)
			})
			.catch(err => console.log(err))
	}


	const thumbsBoxRef = useRef();

	const thumbnailHoveredHandler = (index) => {

		setCurrImageIndex(index)

		const ItemImages = thumbsBoxRef.current
			? thumbsBoxRef.current.children
			: null

		for (let i = 0; i < ItemImages.length; i += 1) {
			ItemImages[i].className = ItemImages[i].className.replace('active', '');
		}
		ItemImages[index].className = 'active';
	}







	if (!item || !sellerReviews || !itemImages) {
		return <Loader />
	}

	return (
		<div className='container mt-4'>
			<DetailNav />
			{
				alertMessage &&
				<Alert
					fixed
					key={alertKey}
					top='550px'
					bgColor='var(--smu-red)'
					message={alertMessage}
				/>
			}
			<div className='itemDetails-box'>
				<div className='item-img-box'>
					<img
						src={itemImages[currImageIndex].ImageURL}
						alt='item-img'
					/>
				</div>
				<div>
					<p className='itemDetails-name'>
						{item.ItemName}
					</p>
					<div className='itemDetails-price'>
						${item.ItemCost}{' '}
						{
							item.IsSold ? '(SOLD)' : null
						}
					</div>
					<p>{item.ItemDetails}</p>
					<div
						className='item-thumbnails-box'
						ref={thumbsBoxRef}
					>
						{
							itemImages.map((img, idx) => (
								<img
									key={idx}
									src={img.ImageURL}
									alt='item-thumbnail'
									onMouseOver={() => thumbnailHoveredHandler(idx)}
								/>
							))
						}
					</div>
					{
						item.IsSold === 0 &&
						parseInt(window.localStorage.getItem('id')) !== seller.UserID &&
						<>
							{
								!isFavorited &&
								<button
									className='btn btn-info btn-lg'
									type='button'
									onClick={favoriteItemHandler}
								>
									Favorite this item
								</button>
							}

							{
								isFavorited &&
								<button
									className='btn btn-info btn-lg'
									type='button'
									onClick={unfavoriteItemHandler}
								>
									Unfavorite Item
								</button>
							}
						</>
					}
					<CopyToClipboard text={currUrl}>
						<button
							onClick={e => {
								setAlertMessage('URL Copied!')
								setAlertKey(getId())
							}}
							className='ml-3 btn btn-info btn-lg'
						>
							<i className='fas fa-share-alt share-logo'></i>
						</button>
					</CopyToClipboard>
				</div>
			</div>

			<SellerInfo
				seller={seller}
				item={item}
			/>

			{
				parseInt(window.localStorage.getItem('id')) !== seller.UserID &&
				<>
					<ReviewList reviews={sellerReviews} />
					<ReviewForm addReviewHandler={addReviewHandler} />
				</>
			}
		</div>
	)

}

export default ItemDetails;
