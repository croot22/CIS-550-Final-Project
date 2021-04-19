import React from 'react';
import PageNavbar from './PageNavbar';
import YelpRecommendationsRow from './YelpRecommendationsRow';
import '../style/YelpRecommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class YelpRecommendations extends React.Component {
//	constructor(props) {
//		super(props);

		// State maintained by this React component is the selected category type,
		// and the list of attributes, address, customer review and etc. // yelp to come back
//		this.state = {
//			categoryName: "",
//			reccategories: []
//		}

//		this.handlecategoryNameChange = this.handlecategoryNameChange.bind(this);
//		this.submitIds = this.submitIds.bind(this); //tbd : what is this?
//	}

//	handlecategoryNameChange(e) {
//		this.setState({
//			categoryName: e.target.value
//		});
//	}

// Make category a dropdown

	constructor(props) {
		super(props);

		this.state = {
			selectedCategory: "",
			categories: [],
			recRestaurants: []			
		};

		this.submitCategory = this.submitCategory.bind(this);
		this.handleChange = this.handleChange.bind(this); 
	}

	componentDidMount() {
		fetch('http://localhost:8081/yelp/category', {
			method: 'GET'
		}).then(res => {
			return res.json();
		}).then(categoryListObj => {

			let categoryList = categoryListObj.map((categoryObj, i) =>
				<option key={i} value={categoryObj.category}>
				{categoryObj.category}
				</option>
			);//...

			this.setState({
				categories: categoryList,
			});

			if(categoryList.length > 0) {
				this.setState({
					selectedCategory: categoryListObj[0].category
				})
			}
		})
	}

	handleChange(e) {
		this.setState({
			selectedCategory: e.target.value
		});
	}
//gg
	submitCategory() {
		let category = this.state.selectedcategory;
		fetch("http://localhost:8081/yelp/zipcode/15222/weekday/3/hour/5/category/" + this.state.categoryName, // tbd : to variablize the rest 
		{
			method: "GET"
		}).then(res => {
			console.log(res);			
			return res.json();

		}, err => {
			console.log(err);
		}).then(restaurantList => {
			let restaurantDivs = restaurantList.map((restaurant, i) => 
				<restaurantRow key={i} restaurant={restaurant}/>
			);

			this.setState({
				recRestaurants : restaurantDivs
			});
		});
	}


	submitcategory() {
		let category = this.state.selectedCategory;
		let url = new URL('http://localhost:8081/yelp/zipcode/15222/weekday/3/hour/5/cusine/');
		let queryParams = {category: category};
		Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));
		fetch(url, {
			method: 'GET'
		}).then(res => {
			return res.json();
		}, err => {
			return console.log(err);
		}).then(restaurantList => {
			let restaurantDivs = restaurantList.map((restaurant, i) => 
				<restaurantRow restaurant={restaurant} />
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

			        <div className="categories-container">
			          <div className="dropdown-container">
			            <select value={this.state.selectedCategory} onChange={this.handleChange} className="dropdown" id="categoriesDropdown">
			            	{this.state.categories}
			            </select>
			            <button className="submit-btn" id="categoriesSubmitBtn" onClick={this.submitCategory}>Submit</button>

			          </div>
			        </div>

			      </div>
			      <div className="jumbotron">
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
