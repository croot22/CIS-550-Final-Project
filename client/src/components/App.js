import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Dashboard from './Dashboard';
import Recommendations from './Recommendations';
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
							path="/yelpRecommendations"
							render={() => (
								<yelpRecommendations />
							)}
						/>
						<Route
							path="/safety"
							render={() => (
								<safety />
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