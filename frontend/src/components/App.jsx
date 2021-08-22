import './App.css';
import {
	BrowserRouter as Router,
	Redirect,
	Route,
	Switch,
} from 'react-router-dom';
import Landing from './Landing';
import Home from './HomeItems/Home';
import ItemDetails from './HomeItems/ItemDetails';
import Login from './auth/Login';
import Error from './Error';
import Chat from './messaging/Chat/Chat';
import SellItem from './Items/SellItem';
import ProfilePage from './profile/ProfilePage';
import Favorites from './Items/Favorites';

// Things I can add to make this app better
// - (Done) Use only functional components
// - (Done) Loader
// - (Done) Alert Messages for filtering for items and sellers
// - (Done) Auto-suggestion for filtering for items
// - Pagination
// - Use TypeScript

// Login credential: akoo, abc123


const App = () => {

	return (
		<>
			<Router>
				{
					window.localStorage.getItem('id') === null && <Redirect to='/' />
				}
				<Switch>
					<Route
						path='/'
						exact
						component={Landing}
					/>
					<Redirect from="/x_profile/:id" to='/profile/:id' />
					<Route
						path='/profile/:id'
						exact
						component={ProfilePage}
					/>
					<Route
						path='/login'
						exact
						component={Login}
					/>
					<Route
						path='/home'
						exact
						component={Home}
					/>
					<Route
						path='/items/:itemId'
						exact
						component={ItemDetails}
					/>
					<Route
						path='/favorites/:itemId'
						exact
						component={Favorites}
					/>
					<Route
						path='/sellItems/:userId'
						exact
						component={SellItem}
					/>
					<Route
						path='/chat'
						exact
						component={Chat}
					/>
					<Route
						component={Error}
					/>
				</Switch>
			</Router>
		</>
	);
}

export default App;
