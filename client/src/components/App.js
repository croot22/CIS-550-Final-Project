import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Dashboard from './Dashboard';
import Recommendations from './Recommendations';
import YelpRecommendations from './YelpRecommendations'; //yelp
import Safety from './Safety'; //yelp
import BestGenres from './BestGenres';
import Posters from './Posters';



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
							path="/dashboard"
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
								<crime />
							)}
						/>
					</Switch>
				</Router>
			</div>
		); 
	}
}

