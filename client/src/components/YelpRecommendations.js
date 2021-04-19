import React from 'react';
import PageNavbar from './PageNavbar';
import RestaurantRow from './YelpRecommendationsRow';
import '../style/YelpRecommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';


// design thought tbd - only show relevant value 

export default class YelpRecommendations extends React.Component {

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

submitCategory() {
		let category = this.state.selectedCategory;
		fetch("http://localhost:8081/yelp/zipcode/15222/weekday/3/hour/18/category/" + this.state.selectedCategory, // tbd : to variablize the rest 
		{
			method: "GET"
		}).then(res => {
			console.log(res);			
			return res.json();

		}, err => {
			console.log(err);
		}).then(restaurantList => {
			let restaurantDivs = restaurantList.map((restaurant, i) => 
				<RestaurantRow key={i} restaurant={restaurant}/>
			);

			this.setState({
				recRestaurants : restaurantDivs
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
			    			<div className="headers">
			    				<div className="header1"><strong>Name</strong></div>  
			    				<div className="header2"><strong>Address</strong></div> 
					            <div className="header3"><strong>Rating</strong></div> 
					            <div className="header4"><strong>Review</strong></div> 
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
