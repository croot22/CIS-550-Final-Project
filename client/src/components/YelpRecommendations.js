import React from 'react';
import PageNavbar from './PageNavbar';
import YelpRecommendationsRow from './YelpRecommendationsRow';
import '../style/YelpRecommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class YelpRecommendations extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the selected cusine type,
		// and the list of attributes, address, customer review and etc. // yelp to come back
		this.state = {
			cusineName: "",
			recCusines: []
		}

		this.handleCusineNameChange = this.handleCusineNameChange.bind(this);
		this.submitIds = this.submitIds.bind(this); //tbd : what is this?
	}

	handleCusineNameChange(e) {
		this.setState({
			cusineName: e.target.value
		});
	}

	submitIds() {
		// http://localhost:8081/yelp/cusine/bars/zipcode/15222/weekday/3/hour/5
		fetch("http://localhost:8081/yelp/cusine/" + this.state.cusineName + "/zipcode/15222/weekday/3/hour/5", // tbd : to variablize the rest 
		{
			method: "GET"
		}).then(res => {
			console.log(res);
			return res.json();
		}, err => {
			console.log(err);
		}).then(restaurantList => {
			let restaurantDivs = restaurantList.map((restaurant, i) => 
				<YelpRecommendationsRow key={i} restaurant={restaurant}/>
			);

			this.setState({
				recRestaurants: restaurantDivs
			});
		});
	}


	render() {

		return (
			<div className="Yelp Recommendations">
				<PageNavbar active="yelp" />

			    <div className="container recommendations-container"> 
			    	<div className="jumbotron">
			    		<div className="h5">Yelp Recommendations</div>			    		
			    		<br></br>
			    		<div className="input-container">
			    			<input type='text' placeholder="Enter Cusine" value={this.state.cusineName} onChange={this.handleCusineNameChange} id="cusineName" className="cusine-input"/>
			    			<button id="submitCusineBtn" className="submit-btn" onClick={this.submitIds}>Submit</button> 
			    		</div>
			    		<div className="header-container">
			    			<div className="h6">You may like ...</div>
			    			<div className="headers">
			    				<div className="header"><strong>Name</strong></div>  
			    				<div className="header"><strong>Address</strong></div> 
					            <div className="header"><strong>Rating</strong></div> 
					            <div className="header"><strong>Review</strong></div> 
			    			</div>
			    		</div>
			    		<div className="results-container" id="results">
			    			{this.state.recRestaurant}
			    		</div>
			    	</div>
			    </div>
		    </div>
		);
	}
}
