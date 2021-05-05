import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import Autosuggest from 'react-autosuggest';

import './Home.css';
import Rating from './Rating';
import PonyListLogo from '../../img/PonyList.PNG';
import { API_URL } from '../../api_url';
import Loader from '../layout/Loader';


const Home = () => {

	const [items, setItems] = useState([])
	// Alert message is two-way bound with userQuery state, so that changing the search input won't change the alert message.
	const [userQuery, setUserQuery] = useState('')
	// For auto suggestion 
	const [suggestions, setSuggestions] = useState([])
	// For searching 
	const [searchItemName, setSearchItemName] = useState('')
	const [searchSellerName, setSearchSellerName] = useState('')
	const [alertShow, setAlertShow] = useState(false)
	const [alertType, setAlertType] = useState('')
	// For sorting 
	const [sortMethod, setSortMethod] = useState('')
	// For filtering 
	const [location, setLocation] = useState('')
	const [condition, setCondition] = useState('')
	const [priceMin, setPriceMin] = useState('')
	const [priceMax, setPriceMax] = useState('')



	// componentDidMount()
	useEffect(() => {

		axios.get(`${API_URL}/items`)
			.then(res => {
				let items = res.data
				setItems(items)
			})

		console.log(items)
	}, [])



	// A set of functions for auto-suggest
	const getSuggestions = (value) => {
		const inputValue = value.trim().toLowerCase()
		const inputLength = inputValue.length

		return inputLength === 0 ? [] : items.filter(item =>
			item.ItemName.toLowerCase().slice(0, inputLength) === inputValue
		)
	}

	const getSuggestionValue = (suggestion) => suggestion.ItemName;

	const renderSuggestion = (suggestion) => (
		<div>
			{suggestion.ItemName}
		</div>
	)

	const onInputChange = (event, { newValue }) => {
		setUserQuery(newValue)
	}

	const onSuggestionsFetchRequested = ({ value }) => {
		setSuggestions(getSuggestions(value))
	}

	const onSuggestionsClearRequested = () => {
		setSuggestions([])
	}

	const inputProps = {
		placeholder: 'Enter an item...',
		value: userQuery,
		onChange: onInputChange
	}

	const theme = {
		input: {
			display: 'block',
			// width: '100%',
			width: '320px',
			marginTop: '0.5rem',
			marginLeft: '2rem',
			height: '2.5rem',
			padding: '.375rem .75rem',
			color: '#495057',
			backgroundClip: 'padding-box',
			border: '1px solid #ced4da',
			borderRadius: '.25rem',
			transition: 'border-color .15s ease -in -out, box - shadow .15s ease -in -out'
		},
		suggestionsList: {
			listStyle: 'none',
			marginTop: '0.5rem',
			marginLeft: '2rem',
			paddingTop: '0.5rem',
			paddingLeft: '0.75rem',
			border: '1px solid #ced4da',
			borderRadius: '.25rem',
		},
		suggestion: {
			cursor: 'pointer'
		}
	}





	const userSearch = (userQuery, searchType) => {
		// Fetch items on every search, this resets the items
		axios.get(`${API_URL}/items`)
			.then(res => {
				let fetchedItems = res.data
				let itemProperty = ''

				if (searchType === 'item') {
					itemProperty = 'ItemName'
				}
				else if (searchType === 'seller') {
					itemProperty = 'Username'
				}

				// This makes the search case-insensitive and whitespace-insensitive
				let filteredItems = fetchedItems.filter(item =>
					item[itemProperty]
						.toLowerCase()
						.replace(/\s+/g, '')
						.includes(userQuery.toLowerCase().replace(/\s+/g, ''))
				)

				// If it's an empty search, just re-fetch items, show no message
				if (filteredItems.length === fetchedItems.length) {
					setItems(filteredItems)
					setAlertShow(false)
				}
				else if (filteredItems.length > 0) {
					setItems(filteredItems)
					setAlertShow(true)
					setAlertType('found')
				}
				else if (filteredItems.length === 0) {
					setAlertShow(true)
					setAlertType('notFound')
				}

				setUserQuery(userQuery)
			})


	}


	// SIDE BAR

	const startOver = () => {
		axios.get(`${API_URL}/items`)
			.then(res => setItems(res.data))
		// Clear input fields
		setSearchItemName('')
		setSearchSellerName('')
		setSortMethod('')
		setLocation('')
		setCondition('')
		setPriceMin('')
		setPriceMax('')

		window.location.reload();  // Can't figure out how to reset the radio btn without reloading
	}


	const sortItems = (sortMethod) => {

		let copyItems = [...items]

		if (sortMethod == 'priceLH') {
			copyItems.sort((a, b) => {
				return a.ItemCost - b.ItemCost;
			})
		}
		else if (sortMethod == 'priceHL') {
			copyItems.sort((a, b) => {
				return b.ItemCost - a.ItemCost;
			})
		}
		else if (sortMethod == 'date') {
			copyItems.sort((a, b) => {
				let dateA = new Date(a.DatePosted);
				let dateB = new Date(b.DatePosted);
				return dateB - dateA;
			})
		}
		else if (sortMethod == 'sellerRating') {
			copyItems.sort((a, b) => {
				return b.Rating - a.Rating;
			})
		}

		setItems(copyItems)
	}


	const filterItems = () => {
		// This resets the items on every new filter
		axios.get(`${API_URL}/items`)
			.then(res => {

				let fetchedItems = res.data

				// Location
				if (location == 'onCampus') {
					let filteredItems = fetchedItems.filter(
						item => item.OnCampus == 'YES'
					)
					if (filteredItems.length > 0) {
						setItems(filterItems)
					}
					else if (filteredItems.length === 0) {
						setAlertShow(true)
						setAlertType('notFound')
					}
				}
				else if (location == 'offCampus') {
					let filteredItems = fetchedItems.filter(
						item => item.OnCampus == 'NO'
					)
					if (filteredItems.length > 0) {
						setItems(filterItems)
					}
					else if (filteredItems.length === 0) {
						setAlertShow(true)
						setAlertType('notFound')
					}
				}

				// Condition
				if (condition == 'new') {
					let filteredItems = fetchedItems.filter(
						item => item.Condition == 'New'
					)
					if (filteredItems.length > 0) {
						setItems(filterItems)
					}
					else if (filteredItems.length === 0) {
						setAlertShow(true)
						setAlertType('notFound')
					}
				}
				else if (condition == 'used') {
					let filteredItems = fetchedItems.filter(
						item => item.Condition == 'Used'
					)
					if (filteredItems.length > 0) {
						setItems(filterItems)
					}
					else if (filteredItems.length === 0) {
						setAlertShow(true)
						setAlertType('notFound')
					}
				}

				// Min price range
				if (priceMin) {
					let filteredItems = fetchedItems.filter(
						item => item.ItemCost >= priceMin
					)
					if (filteredItems.length > 0) {
						setItems(filterItems)
					}
					else if (filteredItems.length === 0) {
						setAlertShow(true)
						setAlertType('notFound')
					}
				}
				// Max price range
				if (priceMax) {
					let filteredItems = fetchedItems.filter(
						item => item.ItemCost <= priceMax
					)
					if (filteredItems.length > 0) {
						setItems(filterItems)
					}
					else if (filteredItems.length === 0) {
						setAlertShow(true)
						setAlertType('notFound')
					}
				}
			})
	}






	if (items.length === 0) {
		return <Loader />
	}

	return (
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
						onClick={() => window.localStorage.removeItem('id')}
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
						value={sortMethod}
						onChange={event => {
							setSortMethod(event.target.value)
							sortItems(event.target.value)
						}}
					>
						<option value='' disabled>Choose...</option>
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
						value={location}
						onChange={event => setLocation(event.target.value)}
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
						onChange={event => setCondition(event.target.value)}
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
						onChange={event => setCondition(event.target.value)}
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
						value={priceMin}
						onChange={event => setPriceMin(event.target.value)}
					/>
					<input
						type='text'
						className='price-range-input-max form-control form-control-sm'
						placeholder='$ Max'
						value={priceMax}
						onChange={event => setPriceMax(event.target.value)}
					/>
				</div>

				<div className='side-nav-bar-btn-box'>
					<button
						className='btn btn-secondary btn-sm mr-3'
						type='button'
						onClick={startOver}
					>
						Start over
            </button>

					<button
						type='button'
						className='btn btn-info btn-sm'
						onClick={filterItems}
					>
						Filter
            	</button>
				</div>
			</nav>

			<div className='search-bar-container'>

				<div className='search-bars-box'>

					<Autosuggest
						suggestions={suggestions}
						onSuggestionsFetchRequested={onSuggestionsFetchRequested}
						onSuggestionsClearRequested={onSuggestionsClearRequested}
						getSuggestionValue={getSuggestionValue}
						renderSuggestion={renderSuggestion}
						inputProps={inputProps}
						theme={theme}
					/>
					<button
						className='btn btn-primary btn-search-item'
						type='button'
						onClick={() => userSearch(searchItemName, 'item')}
					>
						<i className='fas fa-search'></i>
					</button>

					{/* <div className='input-group'>
						<input
							type='text'
							className='search-bar-input form-control'
							placeholder='Enter an item...'
							value={searchItemName}
							onChange={event => setSearchItemName(event.target.value)}
						/>
						<div className='input-group-append'>
							<button
								className='btn btn-primary'
								type='button'
								onClick={() => userSearch(searchItemName, 'item')}
							>
								<i className='fas fa-search'></i>
							</button>
						</div>
					</div> */}
					<div className='input-group'>
						<input
							className='search-bar-input form-control'
							type='text'
							placeholder='Enter a seller...'
							value={searchSellerName}
							onChange={event => setSearchSellerName(event.target.value)}
						/>
						<div className='input-group-append'>
							<button
								className='btn btn-primary'
								type='button'
								onClick={() => userSearch(searchSellerName, 'seller')}
							>
								<i className='fas fa-search'></i>
							</button>
						</div>
					</div>

				</div>

				{/* React Bootstrap alert */}
				<Alert
					className='searchResultAlert'
					variant={alertType === 'found' ? 'success' : 'warning'}
					show={alertShow}
					onClose={() => setAlertShow(false)}
					dismissible
				>
					{
						alertType === 'found'
							? <p><span>{items.length} {items.length === 1 ? 'item' : 'items'} found for "{userQuery}"</span></p>
							: <p><span>No match found.</span> Please try a different search.</p>
					}
				</Alert>

			</div>


			<div className='items-container'>
				{
					items.map((item, idx) => (
						<div key={idx} className='item-box'>
							<Link to={`/items/${item.ItemID}`}>
								<div className='text-center mt-2'>
									<b className='item-name'>{item.ItemName}</b>
								</div>
								<div className='m-2'>
									<p className='itemDetails-text text-secondary'>
										{
											// Limit the ItemDetails text to 80 chars
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
										<Link to={`/profile/${item.SellerID}`}>{item.Username}</Link>
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
	)
}

export default Home;
