import React from 'react';
import { Link } from 'react-router-dom';

import './Home.css';
import Rating from './product/Rating';
import PonyListLogo from '../img/PonyList.PNG';
import { ProductsRepository } from './api/ProductsRepository';
import Alert from 'react-bootstrap/Alert';


export class Home extends React.Component {
	state = {
		products: [],
		users: [],
		// For searching
		searchItemName: '',
		searchSellerName: '',
		alertShow: '',
		// For sorting
		sortMethod: '',
		// For filtering
		location: '',
		condition: '',
		priceMin: '',
		priceMax: '',
	};

	productsRepository = new ProductsRepository();

	searchItem(input) {
		this.productsRepository.getProducts().then(products => {
			// This resets the products on every new search
			this.setState({ products });
			// This makes the search case-insensitive and whitespace-insensitive
			let filtered_products = this.state.products.filter(item =>
				item.ItemName.toLowerCase()
					.replace(/\s+/g, '')
					.includes(input.toLowerCase().replace(/\s+/g, ''))
			);

			if (filtered_products.length > 0) {
				this.setState({ products: filtered_products });
			} else {
				this.setState({ alertShow: 'show' });
			}
		});
	}
	searchSeller(input) {
		this.productsRepository.getProducts().then(products => {
			// This resets the products on every new search
			this.setState({ products });
			// This makes the search case-insensitive and whitespace-insensitive
			let filtered_products = this.state.products.filter(item =>
				item.Username.toLowerCase()
					.replace(/\s+/g, '')
					.includes(input.toLowerCase().replace(/\s+/g, ''))
			);

			if (filtered_products.length > 0) {
				this.setState({ products: filtered_products });
			} else {
				this.setState({ alertShow: 'show' });
			}
		});
	}

	startOver() {
		this.productsRepository
			.getProducts()
			.then(products => this.setState({ products }));
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

	sortProducts(sortMethod) {
		let products = this.state.products;

		if (sortMethod == 'priceLH') {
			products.sort((a, b) => {
				return a.ItemCost - b.ItemCost;
			});
		} else if (sortMethod == 'priceHL') {
			products.sort((a, b) => {
				return b.ItemCost - a.ItemCost;
			});
		} else if (sortMethod == 'date') {
			products.sort((a, b) => {
				let dateA = new Date(a.DatePosted);
				let dateB = new Date(b.DatePosted);
				return dateB - dateA;
			});
		} else if (sortMethod == 'sellerRating') {
			products.sort((a, b) => {
				return b.Rating - a.Rating;
			});
		}

		this.setState({ products });
	}

	filterProducts() {
		this.productsRepository.getProducts()
			.then(x => {
				// This resets the products on every new filter
				this.setState({ products: x });

				let products = this.state.products;

				// Location
				if (this.state.location == 'onCampus') {
					let filtered_products = products.filter(
						item => item.OnCampus == 'YES'
					);
					if (filtered_products.length > 0) {
						this.setState({ products: filtered_products });
						products = filtered_products;
					} else {
						this.setState({ noMatchAlertShow: true });
					}
				} else if (this.state.location == 'offCampus') {
					let filtered_products = products.filter(
						item => item.OnCampus == 'NO'
					);
					if (filtered_products.length > 0) {
						this.setState({ products: filtered_products });
						products = filtered_products;
					} else {
						this.setState({ noMatchAlertShow: true });
					}
				}

				// Condition
				if (this.state.condition == 'new') {
					let filtered_products = products.filter(
						item => item.Condition == 'New'
					);
					if (filtered_products.length > 0) {
						this.setState({ products: filtered_products });
						products = filtered_products;
					} else {
						this.setState({ noMatchAlertShow: true });
					}
				} else if (this.state.condition == 'used') {
					let filtered_products = products.filter(
						item => item.Condition == 'Used'
					);
					if (filtered_products.length > 0) {
						this.setState({ products: filtered_products });
						products = filtered_products;
					} else {
						this.setState({ noMatchAlertShow: true });
					}
				}

				// Min price range
				if (this.state.priceMin) {
					let filtered_products = products.filter(
						item => item.ItemCost >= this.state.priceMin
					);
					if (filtered_products.length > 0) {
						this.setState({ products: filtered_products });
						products = filtered_products;
					} else {
						this.setState({ noMatchAlertShow: true });
					}
				}
				// Max price range
				if (this.state.priceMax) {
					let filtered_products = products.filter(
						item => item.ItemCost <= this.state.priceMax
					);
					if (filtered_products.length > 0) {
						this.setState({ products: filtered_products });
						products = filtered_products;
					} else {
						this.setState({ noMatchAlertShow: true });
					}
				}

			})
	}

	render() {
		if (this.state.products.length == 0 || this.state.users.length == 0) {
			return <div>Loading Home...</div>;
		}

		return (
			<>
				{/* {window.localStorage.getItem('id') === null && <Redirect to='/' />} */}
				<div className='container-fluid master-container mt-4'>

					<div className='banner-container'>
						<div className='banner-logo-box--home'>
							<Link
								to={`/profile/${window.localStorage.getItem(
									'id'
								)}`}
								className='user-logo'
							>
								<i className='fas fa-user'></i>
							</Link>

							<Link className='message-logo' to='/chat'>
								<i className='fas fa-comments'></i>
							</Link>
							<Link className="sell-items-btn">
								Sell Items
							</Link>
							<a
								className='logout-btn'
								href='/'
								onClick={() => {
									window.localStorage.removeItem('id');
								}}
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
								name='sort-menu'
								id='sort-menu'
								className='form-control'
								value={this.state.sortMethod}
								onChange={event => {
									this.setState({
										sortMethod: event.target.value,
									});
									this.sortProducts(event.target.value);
								}}
							>
								<option value='' selected disabled>
									Choose...
                                </option>
								<option value='priceLH'>Price: Low-High</option>
								<option value='priceHL'>Price: High-Low</option>
								<option value='date'>Newest Posts</option>
								<option value='sellerRating'>
									Seller Rating
                                </option>
							</select>
						</div>

						<div className='logo-separator'></div>

						<div className='location-menu-box form-group'>
							<label htmlFor='location-menu'>Location</label>
							<select
								name='location-menu'
								id='location-menu'
								className='form-control'
								value={this.state.location}
								onChange={event =>
									this.setState({
										location: event.target.value,
									})
								}
							>
								<option value='' selected disabled>
									Choose...
                                </option>
								<option value='onCampus'>On-campus</option>
								<option value='offCampus'>Off-campus</option>
							</select>
						</div>

						<div class='condition-radio-box form-check form-check-inline'>
							<input
								class='form-check-input'
								type='radio'
								name='condition-radio-options'
								id='radio-btn-new'
								value='new'
								onChange={event =>
									this.setState({
										condition: event.target.value,
									})
								}
							/>
							<label class='form-check-label' for='radio-btn-new'>
								New
                            </label>
						</div>
						<div class='form-check form-check-inline'>
							<input
								class='form-check-input'
								type='radio'
								name='condition-radio-options'
								id='radio-btn-used'
								value='used'
								onChange={event =>
									this.setState({
										condition: event.target.value,
									})
								}
							/>
							<label
								class='form-check-label'
								for='radio-btn-used'
							>
								Used
                            </label>
						</div>

						<div class='price-range-input-box'>
							<input
								type='text'
								class='price-range-input-min form-control form-control-sm'
								placeholder='$ Min'
								value={this.state.priceMin}
								onChange={event =>
									this.setState({
										priceMin: event.target.value,
									})
								}
							/>
							<input
								type='text'
								class='price-range-input-max form-control form-control-sm'
								placeholder='$ Max'
								value={this.state.priceMax}
								onChange={event =>
									this.setState({
										priceMax: event.target.value,
									})
								}
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
								onClick={() => this.filterProducts()}
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
									onChange={event =>
										this.setState({
											searchItemName:
												event.target.value,
										})
									}
								/>
								<div className='input-group-append'>
									<button
										className='btn btn-primary'
										type='button'
										onClick={() =>
											this.searchItem(
												this.state.searchItemName
											)
										}
									>
										<i className='fas fa-search'></i>
									</button>
								</div>
							</div>
							<div className='input-group'>
								<input
									type='text'
									className='search-bar-input form-control'
									placeholder='Enter a seller...'
									value={this.state.searchSellerName}
									onChange={event =>
										this.setState({
											searchSellerName:
												event.target.value,
										})
									}
								/>
								<div class='input-group-append'>
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
						{/* <Alert
									variant='primary'
									show={this.state.alertShow}
									onClose={() =>
											this.setState({ alertShow: false })
									}
									dismissible
									className='noMatchAlert'
							>
									<Alert.Heading>No match found.</Alert.Heading>
									<p>Please try a different search.</p>
								</Alert> */}

						{/* Regular Bootstrap alert */}
						<div class={`alert alert-warning alert-dismissible fade ${this.state.alertShow} noMatchAlert`} role="alert">
							<strong>Holy guacamole!</strong> Please try a different search.
							<button type="button" 
											className="close"
											onClick={ () => this.setState({ alertShow: '' }) }>
								<span aria-hidden="true">&times;</span>
							</button>
						</div>

					</div>

					<div className='products-container'>
						{this.state.products.map((product, idx) => (
							<div key={idx} className='product-box'>
								<Link to={`/products/${product.ItemID}`}>
									<div className='text-center mt-2'>
										<b className='product-name'>
											{product.ItemName}
										</b>
									</div>
									<div className='m-2'>
										<p className='productDetails-text text-secondary'>
											{/* Limit the productDetail text to 80 chars */}
											{product.ItemDetails.length < 80 ?
												product.ItemDetails : `${product.ItemDetails.slice(0, 80)}...`
											}
										</p>
									</div>
								</Link>

								<div className='lower-half-product-box'>
									<img
										src={product.ImageURL}
										alt='product-image'
									/>
									<div>
										<div className='badge badge-primary ml-2'>
											${product.ItemCost}
										</div>
										<p className='mt-3 ml-2'>
											By&nbsp;
                      <Link
												to={`/profile/${product.SellerID}`}
											>
												{
													this.state.users.find(
														user =>
															user.UserID ===
															product.SellerID
													).Username
												}
											</Link>
											<Rating
												value={product.Rating}
												class='stars-box-sm'
											/>
											<p>
												<small className='text-muted'>
													{new Date(product.DatePosted).getFullYear()}-{new Date(product.DatePosted).getMonth() + 1}-{new Date(product.DatePosted).getDate()}
												</small>
											</p>
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</>
		);
	}

	async componentDidMount() {
		var thing;
		var thing1;
		var myPosition = await window.navigator.geolocation.getCurrentPosition(
			await function (position) {
				thing = position;
				thing1 = thing.coords.latitude;
				console.log(thing, 'is good');
				return position;
			}
		);
		console.log(thing1, ' should be ');
		// var config = {
		//     method: 'patch',
		//     url: `http://18.188.219.228:8000/updateMilesAway/${window.localStorage.getItem(
		//         'id'
		//     )}/${distance(
		//         parseFloat(myPosition.coords.latitude),
		//         parseFloat(myPosition.coords.longitude)
		//     )}`,
		//     headers: {},
		//     data: data,
		// };

		// axios(config)
		//     .then(function (response) {
		//         console.log(JSON.stringify(response.data));
		//     })
		//     .catch(function (error) {
		//         console.log(error);
		//     });

		this.productsRepository.getProducts().then(products =>
			this.setState({
				products: products.filter(product => product.IsSold !== 1),
			})
		);
		this.productsRepository
			.getUsers()
			.then(users => this.setState({ users }));
	}
}

export default Home;
