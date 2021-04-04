import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import './Home.css';
import Rating from './Rating';
import PonyListLogo from '../../img/PonyList.PNG';
import { ItemsRepository } from '../api/ItemsRepository';
import Alert from 'react-bootstrap/Alert';
import Loader from '../layout/Loader';


class Home extends Component {
	state = {
		items: [],
		sellers: [],

		userQuery: '',
		// For searching
		searchItemName: '',
		searchSellerName: '',
		alertShow: false,
		alertType: '',
		// For sorting
		sortMethod: '',
		// For filtering
		location: '',
		condition: '',
		priceMin: '',
		priceMax: '',
	};

	ItemsRepository = new ItemsRepository();


	searchItem(userQuery) {
		// Fetch items on every search, this resets the items
		this.ItemsRepository.getItems()
			.then(items => {
				this.setState({ items })
				// This makes the search case-insensitive and whitespace-insensitive
				let filtered_items = this.state.items.filter(item =>
					item.ItemName
						.toLowerCase()
						.replace(/\s+/g, '')
						.includes(userQuery.toLowerCase().replace(/\s+/g, ''))
				)

				// Means it's an empty search, just re-fetch items, show no message
				if (filtered_items.length == items.length) {
					this.setState({ 
						items: filtered_items,
						alertShow: false,
						userQuery })
				}
				else if (filtered_items.length > 0) {
					this.setState({
						items: filtered_items,
						alertType: 'found',
						alertShow: true,
						userQuery
					})
				}
				else {
					this.setState({
						alertType: 'notFound',
						alertShow: true,
						userQuery
					})
				}
			})
	}

	searchSeller(userQuery) {
		// Fetch sellers on every search, this resets the sellers
		this.ItemsRepository.getSellers()
			.then(sellers => {
				this.setState({ sellers })
				// This makes the search case-insensitive and whitespace-insensitive
				let filtered_sellers = this.state.sellers.filter(seller =>
					seller.SellerName
						.toLowerCase()
						.replace(/\s+/g, '')
						.includes(userQuery.toLowerCase().replace(/\s+/g, ''))
				)

				// Means it's an empty search, just re-fetch sellers, show no message
				if (filtered_sellers.length == sellers.length) {
					this.setState({ sellers: filtered_sellers })
				}
				else if (filtered_sellers.length > 0) {
					this.setState({
						sellers: filtered_sellers,
						alertType: 'found',
						alertShow: true
					})
				}
				else {
					this.setState({
						alertType: 'notFound',
						alertShow: true
					})
				}
			})
	}

	startOver() {
		this.ItemsRepository.getItems()
			.then(items => this.setState({ items }));
		// Clear input fields
		this.setState({
			searchItemName: '',
			searchSeller: '',
			sortMethod: '',
			location: '',
			condition: '',
			priceMin: '',
			priceMax: '',
		});
		window.location.reload();  // Can't figure out how to reset the radio btn without reloading
	}

	sortItems(sortMethod) {
		let items = this.state.items;

		if (sortMethod == 'priceLH') {
			items.sort((a, b) => {
				return a.ItemCost - b.ItemCost;
			});
		} else if (sortMethod == 'priceHL') {
			items.sort((a, b) => {
				return b.ItemCost - a.ItemCost;
			});
		} else if (sortMethod == 'date') {
			items.sort((a, b) => {
				let dateA = new Date(a.DatePosted);
				let dateB = new Date(b.DatePosted);
				return dateB - dateA;
			});
		} else if (sortMethod == 'sellerRating') {
			items.sort((a, b) => {
				return b.Rating - a.Rating;
			});
		}

		this.setState({ items });
	}

	filterItems() {
		this.ItemsRepository.getItems()
			.then(x => {
				// This resets the items on every new filter
				this.setState({ items: x });

				let items = this.state.items;

				// Location
				if (this.state.location == 'onCampus') {
					let filtered_items = items.filter(
						item => item.OnCampus == 'YES'
					);
					if (filtered_items.length > 0) {
						this.setState({ items: filtered_items });
						items = filtered_items;
					} else {
						this.setState({ noMatchAlertShow: true });
					}
				} else if (this.state.location == 'offCampus') {
					let filtered_items = items.filter(
						item => item.OnCampus == 'NO'
					);
					if (filtered_items.length > 0) {
						this.setState({ items: filtered_items });
						items = filtered_items;
					} else {
						this.setState({ noMatchAlertShow: true });
					}
				}

				// Condition
				if (this.state.condition == 'new') {
					let filtered_items = items.filter(
						item => item.Condition == 'New'
					);
					if (filtered_items.length > 0) {
						this.setState({ items: filtered_items });
						items = filtered_items;
					} else {
						this.setState({ noMatchAlertShow: true });
					}
				} else if (this.state.condition == 'used') {
					let filtered_items = items.filter(
						item => item.Condition == 'Used'
					);
					if (filtered_items.length > 0) {
						this.setState({ items: filtered_items });
						items = filtered_items;
					} else {
						this.setState({ noMatchAlertShow: true });
					}
				}

				// Min price range
				if (this.state.priceMin) {
					let filtered_items = items.filter(
						item => item.ItemCost >= this.state.priceMin
					);
					if (filtered_items.length > 0) {
						this.setState({ items: filtered_items });
						items = filtered_items;
					} else {
						this.setState({ noMatchAlertShow: true });
					}
				}
				// Max price range
				if (this.state.priceMax) {
					let filtered_items = items.filter(
						item => item.ItemCost <= this.state.priceMax
					);
					if (filtered_items.length > 0) {
						this.setState({ items: filtered_items });
						items = filtered_items;
					} else {
						this.setState({ noMatchAlertShow: true });
					}
				}

			})
	}

	render() {

		if (this.state.items.length === 0 || this.state.sellers.length === 0) {
			return <Loader />
		}

		return (
			<>
				{
					window.localStorage.getItem('id') === null && <Redirect to='/' />
				}

				<div className='container-fluid master-container mt-4'>

					<div className='banner-container'>
						<div className='banner-logo-box--home'>
							<Link
								to={`/profile/${window.localStorage.getItem('id')}`}
								className='user-logo'
							>
								<i className='fas fa-user'></i>
							</Link>

							<Link
								to='/chat'
								className='message-logo'>
								<i className='fas fa-comments'></i>
							</Link>
							<Link
								to={`/sellItems/${window.localStorage.getItem('id')}`}
								className="sell-items-btn"
							>
								Sell Item
							</Link>
							<a
								className='logout-btn'
								href='/'
								onClick={() => { window.localStorage.removeItem('id') }}
							>
								Logout
              </a>
						</div>
					</div>

					<nav className='side-nav-bar-container'>
						<div className='side-nav-bar-img-box'>
							<img
								src={PonyListLogo}
								alt='PonyList-logo'
								width='100px'
								height='100px'
							/>
						</div>

						<div className='logo-separator'></div>

						<div className='sort-menu-box form-group'>
							<label htmlFor='sort-menu'>Sort By</label>
							<select
								id='sort-menu'
								className='form-control'
								name='sort-menu'
								value={this.state.sortMethod}
								onChange={event => {
									this.setState({ sortMethod: event.target.value })
									this.sortItems(event.target.value)
								}}
							>
								<option value='' selected disabled>Choose...</option>
								<option value='priceLH'>Price: Low-High</option>
								<option value='priceHL'>Price: High-Low</option>
								<option value='date'>Newest Posts</option>
								<option value='sellerRating'>Seller Rating</option>
							</select>
						</div>

						<div className='logo-separator'></div>

						<div className='location-menu-box form-group'>
							<label htmlFor='location-menu'>Location</label>
							<select
								id='location-menu'
								className='form-control'
								name='location-menu'
								value={this.state.location}
								onChange={event => this.setState({ location: event.target.value })}
							>
								<option value='' selected disabled>Choose...</option>
								<option value='onCampus'>On-campus</option>
								<option value='offCampus'>Off-campus</option>
							</select>
						</div>

						<div className='condition-radio-box form-check form-check-inline'>
							<input
								id='radio-btn-new'
								className='form-check-input'
								type='radio'
								name='condition-radio-options'
								value='new'
								onChange={event => this.setState({ condition: event.target.value })}
							/>
							<label className='form-check-label' htmlFor='radio-btn-new'>New</label>
						</div>
						<div className='form-check form-check-inline'>
							<input
								id='radio-btn-used'
								className='form-check-input'
								type='radio'
								name='condition-radio-options'
								value='used'
								onChange={event => this.setState({ condition: event.target.value })}
							/>
							<label className='form-check-label' htmlFor='radio-btn-used'>
								Used
              </label>
						</div>

						<div className='price-range-input-box'>
							<input
								type='text'
								className='price-range-input-min form-control form-control-sm'
								placeholder='$ Min'
								value={this.state.priceMin}
								onChange={event => this.setState({ priceMin: event.target.value })}
							/>
							<input
								type='text'
								className='price-range-input-max form-control form-control-sm'
								placeholder='$ Max'
								value={this.state.priceMax}
								onChange={event => this.setState({ priceMax: event.target.value })}
							/>
						</div>

						<div className='side-nav-bar-btn-box'>
							<button
								className='btn btn-secondary btn-sm mr-3'
								type='button'
								onClick={() => this.startOver()}
							>
								Start over
              </button>

							<button
								type='button'
								className='btn btn-info btn-sm'
								onClick={() => this.filterItems()}
							>
								Filter
            	</button>
						</div>
					</nav>

					<div className='search-bar-container'>

						<div className='search-bars-box'>
							<div className='input-group'>
								<input
									type='text'
									className='search-bar-input form-control'
									placeholder='Enter an item...'
									value={this.state.searchItemName}
									onChange={event => this.setState({ searchItemName: event.target.value })}
								/>
								<div className='input-group-append'>
									<button
										className='btn btn-primary'
										type='button'
										onClick={() => this.searchItem(this.state.searchItemName)}
									>
										<i className='fas fa-search'></i>
									</button>
								</div>
							</div>
							<div className='input-group'>
								<input
									className='search-bar-input form-control'
									type='text'
									placeholder='Enter a seller...'
									value={this.state.searchSellerName}
									onChange={event =>
										this.setState({
											searchSellerName:
												event.target.value,
										})
									}
								/>
								<div className='input-group-append'>
									<button
										className='btn btn-primary'
										type='button'
										onClick={() =>
											this.searchSeller(
												this.state.searchSellerName
											)
										}
									>
										<i className='fas fa-search'></i>
									</button>
								</div>
							</div>

						</div>

						{/* React Bootstrap alert */}
						<Alert
							className='searchResultAlert'
							variant={this.state.alertType === 'found' ? 'success' : 'warning'}
							show={this.state.alertShow}
							onClose={() => this.setState({ alertShow: false })}
							dismissible
						>
							{
								this.state.alertType === 'found'
									? <p><span>{this.state.items.length} {this.state.items.length === 1 ? 'item' : 'items'} found for "{this.state.userQuery}"</span></p>
									: <p><span>No match found.</span> Please try a different search.</p>
							}
						</Alert>

						{/* Regular Bootstrap alert */}
						{/* <div class={`alert alert-warning alert-dismissible fade ${this.state.alertShow} noMatchAlert`} role="alert">
							<strong>Holy guacamole!</strong> Please try a different search.
							<button type="button"
								className="close"
								onClick={() => this.setState({ alertShow: '' })}>
								<span aria-hidden="true">&times;</span>
							</button>
						</div> */}
					</div>


					<div className='items-container'>
						{
							this.state.items.map((item, idx) => (
								<div key={idx} className='item-box'>
									<Link to={`/items/${item.ItemID}`}>
										<div className='text-center mt-2'>
											<b className='item-name'>{item.ItemName}</b>
										</div>
										<div className='m-2'>
											<p className='itemDetails-text text-secondary'>
												{/* Limit the itemDetail text to 80 chars */}
												{
													item.ItemDetails.length < 80
														? item.ItemDetails
														: `${item.ItemDetails.slice(0, 80)}...`
												}
											</p>
										</div>
									</Link>

									<div className='lower-half-item-box'>
										<img src={item.ImageURL} alt='item-image' />
										<div>
											<div className='badge badge-primary ml-2'>${item.ItemCost}</div>
											<p className='mt-3 ml-2'>
												By&nbsp;
												<Link to={`/profile/${item.SellerID}`}>
													{
														this.state.sellers.find(seller =>
															seller.UserID === item.SellerID
														).Username
													}
												</Link>
												<Rating class='stars-box-sm' value={item.Rating} />
												<p>
													<small className='text-muted'>
														{new Date(item.DatePosted).getFullYear()}-{new Date(item.DatePosted).getMonth() + 1}-{new Date(item.DatePosted).getDate()}
													</small>
												</p>
											</p>
										</div>
									</div>
								</div>
							))
						}
					</div>
				</div>
			</>
		);
	}


	componentDidMount() {
		this.ItemsRepository.getItems()
			.then(items => this.setState(
				{
					items: items.filter(item => item.IsSold !== 1),
				})
			)
		this.ItemsRepository.getUsers()
			.then(sellers => this.setState({ sellers }));
	}
}

export default Home;
