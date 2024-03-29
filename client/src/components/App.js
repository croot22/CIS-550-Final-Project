import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Dashboard from './Home';
import YelpRecommendations from './YelpRecommendations'; //yelp
import Safety from './Safety'; 
import Crime from './Crime'; 
import Schools from './Schools'; 




export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => (
								<Dashboard />
							)}
						/>
						<Route
							exact
							path="/home"
							render={() => (
								<Dashboard />
							)}
						/>
						<Route
							path="/yelp" // from PageNavbar.js
							render={() => (
								<YelpRecommendations /> // this links to ./YelpRecommendations.js as in the import 
							)}
						/>
						<Route
							path="/safety"
							render={() => (
								<Safety />
							)}
						/>
						<Route
							path="/crime"
							render={() => (
								<Crime />
							)}
						/>
						<Route
							path="/schools"
							render={() => (
								<Schools />
							)}
						/>
					</Switch>
				</Router>
			</div>
		); 
	}
}

