import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Home from './Home';
import YelpRecommendations from './YelpRecommendations';
import Safety from './Safety';
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
								<Home />
							)}
						/>
						<Route
							exact
							path="/Home"
							render={() => (
								<Home />
							)}
						/>
						<Route
							path="/YelpRecommendations"
							render={() => (
								<YelpRecommendations />
							)}
						/>
						<Route
							path="/Safety"
							render={() => (
								<Safety />
							)}
						/>
						<Route
							path="/Schools"
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