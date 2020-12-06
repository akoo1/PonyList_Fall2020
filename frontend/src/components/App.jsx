import './App.css';
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
} from 'react-router-dom';
import Landing from './Landing';
import Home from './Home';
import ProductDetails from './product/ProductDetails';
import Login from './auth/Login';
import Error from './Error';
import Chat from './messaging/Chat/Chat';
import SellItem from './Items/SellItem';
import ProfilePage from './profile/ProfilePage';
import Favorites from './Items/Favorites';
const getLogged = () => {
    let id = window.localStorage.getItem('id');
    console.log(id);
    return id;
};
function App() {
    return (
        // <>
        //   <Router>
        //     <Route path='/chat' exact component={Chat} />
        //   </Router>
        // </>
        <>
            <div>
                <Router>
                    {/* {window.localStorage.getItem('id') === null && <Redirect to='/' />} */}
                    <Switch>
                        <Route path='/' exact component={Landing}></Route>
                        <Redirect from="/x_profile/:id" to='/profile/:id'/>
                        <Route
                            path='/profile/:id'
                            exact
                            component={ProfilePage}
                        />
                        <Route path='/login' exact component={Login} />
                        <Route path='/home' exact component={Home}></Route>
                        <Route
                            path='/products/:productId'
                            exact
                            component={ProductDetails}
                        ></Route>
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
                        <Route path='/chat' exact component={Chat}></Route>
                        <Route component={Error} />
                    </Switch>
                </Router>
            </div>
        </>
    );
}

export default App;
