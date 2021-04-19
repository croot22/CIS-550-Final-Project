import React from 'react';
import PageNavbar from './PageNavbar';
import YelpRecommendationsRow from './YelpRecommendationsRow';
import '../style/YelpRecommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class YelpRecommendations extends React.Component {
//	constructor(props) {
//		super(props);

		// State maintained by this React component is the selected cuisine type,
		// and the list of attributes, address, customer review and etc. // yelp to come back
//		this.state = {
//			cuisineName: "",
//			reccuisines: []
//		}

//		this.handlecuisineNameChange = this.handlecuisineNameChange.bind(this);
//		this.submitIds = this.submitIds.bind(this); //tbd : what is this?
//	}

//	handlecuisineNameChange(e) {
//		this.setState({
//			cuisineName: e.target.value
//		});
//	}

// Make cuisine a dropdown

	constructor(props) {
		super(props);

		this.state = {
			selectedCuisine: "",
			cuisines: []//,
//			genres: []
		};

		this.submitCuisine = this.submitCuisine.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		fetch('http://localhost:8081/yelp/category', {
			method: 'GET'
		}).then(res => {
			return res.json();
		}).then(cuisineListObj => {

			let cuisineList = cuisineListObj.map((cuisineObj, i) =>
				<option key={i} value={cuisineObj.cuisine}>
				{cuisineObj.cuisine}
				</option>
			);

			this.setState({
				cuisines: cuisineList,
			});

			if(cuisineList.length > 0) {
				this.setState({
					selectedCuisine: cuisineListObj[0].cuisine
				})
			}
		})
	}

	handleChange(e) {
		this.setState({
			selectedCuisine: e.target.value
		});
	}

	submitCuisine() {
		let cuisine = this.state.selectedCuisine;
		// http://localhost:8081/yelp/zipcode/15222/weekday/3/hour/5/cuisine/bars
		fetch("http://localhost:8081/yelp/zipcode/15222/weekday/3/hour/5/cuisine/" + this.state.cuisineName, // tbd : to variablize the rest 
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


	submitDecade() {
		let cuisine = this.state.selectedCuisine;
		let url = new URL('http://localhost:8081/yelp/zipcode/15222/weekday/3/hour/5/cusine/');
		let queryParams = {cuisine: cuisine};
		Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));
		fetch(url, {
			method: 'GET'
		}).then(res => {
			return res.json();
		}, err => {
			return console.log(err);
		}).then(genreList => {
			let bestGenreDivs = genreList.map((genre, i) => 
				<BestGenreRow genre={genre} />
			); 

			this.setState({
				genres: bestGenreDivs
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

			        <div className="cuisines-container">
			          <div className="dropdown-container">
			            <select value={this.state.selectedCuisine} onChange={this.handleChange} className="dropdown" id="cuisinesDropdown">
			            	{this.state.cuisines}
			            </select>
			            <button className="submit-btn" id="cuisinesSubmitBtn" onClick={this.submitCuisine}>Submit</button>

			          </div>
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
			    			{this.state.recRestaurants}
			    		</div>
			    	</div>
			    </div>
		    </div>
		);
	}
}
