import React, { Component } from 'react';

import './ItemDetails.css';
import { UserReview } from '../../models/UserReview';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import SellerInfo from './SellerInfo';
import { ItemsRepository } from '../api/ItemsRepository';
import DetailNav from '../layout/DetailNav';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Alert from '../layout/Alert';
import shortid from 'shortid';
import axios from 'axios';
import { API_URL } from '../../api_url';
import Loader from '../layout/Loader';

class ItemDetails extends Component {

	ItemsRepository = new ItemsRepository();

	state = {
		item: '',
		seller: '',
		sellerReviews: '',
		images: '',
		currImgIndex: 0,
		alertMessage: '',
		alertKey: '',
		favorited: false,
	};
	getId() {
		const id = shortid.generate();
		console.log(id);
		return id;
	}
	addReviewHandler = (ReviewText, Rating) => {
		let newReview = new UserReview(
			this.state.item.SellerID,
			this.state.item.ItemID,
			window.localStorage.getItem('id') || 1,
			ReviewText,
			Rating
		);

		this.ItemsRepository.addReview(newReview)
			.then(review => {
				let reviews = [...this.state.sellerReviews];
				reviews.push(review);
				this.setState({ sellerReviews: reviews });
				alert('User review added!');
			});
		// window.location.reload(); // this can be changed here... just temporary unless we run out of time.
	};

	myAddFavoriteItem() {
		let userId = window.localStorage.getItem('id');
		let itemId = this.state.item.ItemID;
		let favoriteItem = { userId, itemId };

		axios.post(`${API_URL}/addFavorite`, {
			UserID: userId,
			ItemID: itemId,
		})
			.then(res => {
				this.setState({ favorited: true });
				this.setState({ alertKey: this.getId() });
			})
			.catch(err => console.log('bad'));
	}

	myRemoveFavoriteItem() {
		let userId = window.localStorage.getItem('id');
		let itemId = this.state.item.ItemID;
		console.log('we are here');
		axios.delete(`${API_URL}/deleteFavorite/${userId}/${itemId}`, {
			UserID: userId,
			ItemID: itemId,
		})
			.then(res => {
				console.log('good');
				this.setState({ favorited: false });
			})
			.catch(err => console.log('bad'));
	}

	thumbsBoxRef = React.createRef();

	thumbnailHoveredHandler = idx => {
		this.setState({ currImgIndex: idx });

		const images = this.thumbsBoxRef.current
			? this.thumbsBoxRef.current.children
			: null;
		for (let i = 0; i < images.length; i += 1) {
			images[i].className = images[i].className.replace('active', '');
		}
		images[idx].className = 'active';
	};

	render() {
		const url = window.location.href;
		if (
			!this.state.item ||
			!this.state.sellerReviews ||
			!this.state.images
		) {
			return <Loader />
		}


		return (
			<div className='container mt-4'>
				<DetailNav />
				{
					this.state.alertMessage && (
						<Alert
							fixed
							key={this.state.alertKey}
							top='550px'
							bgColor='var(--smu-red)'
							message={this.state.alertMessage}
						/>
					)
				}
				<div className='itemDetails-box'>
					<div className='item-img-box'>
						<img
							src={this.state.images[this.state.currImgIndex].ImageURL}
							alt='item-img'
						/>
					</div>
					<div>
						<p className='itemDetails-name'>
							{this.state.item.ItemName}
						</p>
						<div className='itemDetails-price'>
							${this.state.item.ItemCost}{' '}
							{this.state.item.IsSold ? '(SOLD)' : null}
						</div>
						<p>{this.state.item.ItemDetails}</p>
						<div
							className='item-thumbnails-box'
							ref={this.thumbsBoxRef}
						>
							{
								this.state.images.map((img, idx) => (
									<img
										key={idx}
										src={img.ImageURL}
										alt='item-img'
										onMouseOver={() => this.thumbnailHoveredHandler(idx)}
									/>
								))
							}
						</div>
						{this.state.item.IsSold === 0 &&
							parseInt(window.localStorage.getItem('id')) !==
							this.state.seller.UserID && (
								<>
									{!this.state.favorited && (
										<button
											type='button'
											className='btn btn-info btn-lg'
											onClick={() =>
												this.myAddFavoriteItem()
											}
										>
											Favorite this item
										</button>
									)}

									{this.state.favorited && (
										<button
											type='button'
											className='btn btn-info btn-lg'
											onClick={() =>
												this.myRemoveFavoriteItem()
											}
										>
											Unfavorite Item
										</button>
									)}
								</>
							)}
						<CopyToClipboard text={url}>
							<button
								onClick={e => {
									this.setState({
										alertMessage: 'URL Copied!',
									});
									this.setState({ alertKey: this.getId() });
								}}
								className='ml-3 btn btn-info btn-lg'
							>
								<i className='fas fa-share-alt share-logo'></i>
							</button>
						</CopyToClipboard>
					</div>
				</div>

				<SellerInfo
					seller={this.state.seller}
					item={this.state.item}
				/>

				{
					parseInt(window.localStorage.getItem('id')) !== this.state.seller.UserID &&
					<>
						<ReviewList reviews={this.state.sellerReviews} />
						<ReviewForm addReviewHandler={this.addReviewHandler} />
					</>
				}
			</div>
		)
	}


	componentDidMount() {
		// Get the item (the item and user are both returned as a single object in an array)
		const itemId = +this.props.match.params.itemId;
		this.ItemsRepository.getItem(itemId)
			.then(item => this.setState({ item: item[0] }))
			.then(() => {
				// Get the sellerReviews
				const sellerId = this.state.item.SellerID;
				this.ItemsRepository.getSellerReviews(sellerId)
					.then(reviews => this.setState({ sellerReviews: reviews }));
			})
			.then(() => {
				// Get the seller
				const sellerId = this.state.item.SellerID;
				this.ItemsRepository.getUser(sellerId)
					.then(user => this.setState({ seller: user[0] }));
			})
			.then(() => {
				// Get item images
				this.ItemsRepository.getImages(itemId)
					.then(images => this.setState({ images }))
					.then(() => {
						// To add the "active" className to the initial active image
						const idx = this.state.currImgIndex;
						if (this.thumbsBoxRef.current) {
							this.thumbsBoxRef.current.children[idx].className =
								'active';
						}
					})
			})
			.then(() => {
				axios.get(`${API_URL}/favoritedBy/${this.state.item.ItemID}`)
					.then(res => {
						let likedByMe = res.data.filter(user =>
									user.UserID === parseInt(window.localStorage.getItem('id'))).length > 0;
						this.setState({ favorited: likedByMe });
					})
			})
	}
}

export default ItemDetails;
