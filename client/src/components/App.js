import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Home from './Home';
import Venue from './Venue'; 
import PartyRentals from './PartyRentals'; 
import Pricing from './Pricing'; 



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
							path="/Venue"
							render={() => (
								<Venue />
							)}
						/>
						<Route
							path="/Party Rentals"
							render={() => (
								<PartyRentals />
							)}
						/>
						<Route
							path="/Pricing"
							render={() => (
								<Pricing />
							)}
						/>
					</Switch>
				</Router>
			</div>
		); 
	}
}

