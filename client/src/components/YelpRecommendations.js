import React from 'react';
import PageNavbar from './PageNavbar';
import RestaurantRow from './YelpRecommendationsRow';
import ActivityRow from './YelpActivitiesRow';
import '../style/YelpRecommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';


// design thought tbd - only show relevant value 

export default class YelpRecommendations extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedCategory: "",
			categories: [],
			selectedZipcode: "",
			zipcodes: [],
			selectedWeekday: "",
			weekdays: [],
			selectedHour: "",
			hours: []	
		};

		this.handleChangeCategory= this.handleChangeCategory.bind(this); 
		this.handleChangeZipcode= this.handleChangeZipcode.bind(this); 
		this.handleChangeWeekday= this.handleChangeWeekday.bind(this); 
		this.handleChangeHour= this.handleChangeHour.bind(this); 

		this.submitCategory = this.submitCategory.bind(this);

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
		fetch('http://localhost:8081/yelp/zipcode', {
			method: 'GET'
		}).then(res => {
			return res.json();
		}).then(zipcodeListObj => {

			let zipcodeList = zipcodeListObj.map((zipcodeObj, i) =>
				<option key={i} value={zipcodeObj.zipcode}>
				{zipcodeObj.zipcode}
				</option>
			);//...

			this.setState({
				zipcodes: zipcodeList,
			});

			if(zipcodeList.length > 0) {
				this.setState({
					selectedZipcode: zipcodeListObj[0].zipcode
				})
			}
		})		
		fetch('http://localhost:8081/yelp/weekday', {
			method: 'GET'
		}).then(res => {
			return res.json();
		}).then(weekdayListObj => {

			let weekdayList = weekdayListObj.map((weekdayObj, i) =>
				<option key={i} value={weekdayObj.weekday}>
				{weekdayObj.weekday}
				</option>
			);//...

			this.setState({
				weekdays: weekdayList,
			});

			if(weekdayList.length > 0) {
				this.setState({
					selectedWeekday: weekdayListObj[0].weekday
				})
			}
		})			
		fetch('http://localhost:8081/yelp/hour', {
			method: 'GET'
		}).then(res => {
			return res.json();
		}).then(hourListObj => {

			let hourList = hourListObj.map((hourObj, i) =>
				<option key={i} value={hourObj.hour}>
				{hourObj.hour}
				</option>
			);//...

			this.setState({
				hours: hourList,
			});

			if(hourList.length > 0) {
				this.setState({
					selectedHour: hourListObj[0].hour
				})
			}
		})			
	}

	handleChangeCategory(e) {
		this.setState({
			selectedCategory: e.target.value
		});
	}

	handleChangeZipcode(e) {
		this.setState({
			selectedZipcode: e.target.value
		});
	}

	handleChangeWeekday(e) {
		this.setState({
			selectedWeekday: e.target.value
		});
	}

	handleChangeHour(e) {
		this.setState({
			selectedHour: e.target.value
		});
	}

	submitCategory() {
		let category = this.state.selectedCategory;
		let zipcode = this.state.selectedZipcode;
		let weekday = this.state.selectedWeekday;
		let hour = this.state.selectedHour;
		fetch("http://localhost:8081/yelp/zipcode/"+this.state.selectedZipcode+"/weekday/"+this.state.selectedWeekday+"/hour/"+this.state.selectedHour+"/category/" + this.state.selectedCategory, 
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

		fetch("http://localhost:8081/yelp/zipcode/"+this.state.selectedZipcode+"/weekday/"+this.state.selectedWeekday+"/hour/"+this.state.selectedHour, 
		{
			method: "GET"
		}).then(res => {
			console.log(res);			
			return res.json();

		}, err => {
			console.log(err);
		}).then(activityList => {
			let activityDivs = activityList.map((activity, i) => 
				<ActivityRow key={i} activity={activity}/>
			);

			this.setState({
				recActivities : activityDivs
			});
		});
	}

	render() {

		return (
			<div className="Yelp Recommendations">
				
				<PageNavbar active="yelp" />

			    <div className="container recommendations-container"> 

			    	<div className="jumbotron">
			    		
			    		<div className="h5" style={{marginBottom: 20}}><img src="yelp-512.jpg" alt="yelp"width="100" height="50"></img> Recommendations</div>					 			    		
			    		<div className="h5" style={{marginBottom: 20}}>Select the cuisine type, zipcode, day of week and hour in the dropdown menu below</div>		
			        	<div className="categories-container">
			          		<div className="dropdown-container" style={{marginBottom: 20}} >
			          			
			            		<select			       
			            			 			            			
			            			onChange = {this.handleChangeCategory} 
			            			className="dropdown" 
			            			id="categoriesDropdown">{this.state.categories}> 
									<option value="" selected disabled hidden> -- select category -- </option>
			            		</select>			

			           			<select 
			           				onChange={this.handleChangeZipcode}
			           				className="dropdown"
			           				id="zipcodesDropdown">{this.state.zipcodes}>
									   <option value="" selected disabled hidden> -- select zipcode -- </option>
			           			</select>
			           			<select 
			           				onChange={this.handleChangeWeekday} 
			           				className="dropdown" 
			           				id="weekdaysDropdown">{this.state.weekdays}>
									   <option value="" selected disabled hidden> -- select day -- </option>
			           			</select>
			           			<select 
			           				
			           				onChange={this.handleChangeHour} 
			           				className="dropdown" 
			           				id="hoursDropdown">{this.state.hours}>
									   <option value="" selected disabled hidden> -- select time -- </option>
			           			</select>			
			           			<button className="submit-btn" id="categoriesSubmitBtn" onClick={this.submitCategory}>Submit</button>
			       			</div>

			       			<div className="h5" style={{marginBottom: 20}} >Around this time, people lives here typically likes to :</div>		
			       			<div className="header-container">
			    				<div className="headers">
									<div className="header0"><strong>Activity</strong></div>  
			    				</div>
			   				</div>
			 				<div className="results-container" id="results">
			    				{this.state.recActivities}
			    			</div>

			       		</div>
			      	</div>
			      	
			      	<div className="jumbotron">
			      		<div className="h5"style={{marginBottom: 20}}> Based on your selection, you may want to check out these places :</div>	
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
