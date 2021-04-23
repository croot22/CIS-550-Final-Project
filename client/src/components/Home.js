import React from 'react';
import PageNavbar from './PageNavbar';
import HomeRow from './HomeRow';
import TopZipRow from './TopZipRow';
import '../style/Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedZipcode: "",
			selectedCategory: "",
			homeZipcodes: [],
      		selectedZipInfo: [],
			topZips: []
		};

		this.submitZipcode = this.submitZipcode.bind(this);
		this.submitCategory = this.submitCategory.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleCatChange = this.handleCatChange.bind(this);
	}

	componentDidMount() {
    //populate dropdown with zipcodes
		fetch('http://localhost:8081/home/zipcodes', {
			method: 'GET'
		}).then(res => {
			return res.json();
		}).then(zipcodeListObj => {
			let zipcodeList = zipcodeListObj.map((zipcodeObj, i) =>
				<option key={i} value={zipcodeObj.zipcode}>
				{zipcodeObj.zipcode}
				</option>
			);

			this.setState({
				homeZipcodes: zipcodeList,
			});

			if(zipcodeList.length > 0) {
				this.setState({
					selectedZipcode: zipcodeListObj[0].zipcode
				})
			}
		}) 
	}

	handleChange(e) {
		this.setState({
			selectedZipcode: e.target.value
		});
	}

	handleCatChange(e) {
		this.setState({
			selectedCategory: e.target.value
		});
	}
	// get avg purchase price in selected zip
	submitZipcode() {
		let homeZipcode = this.state.selectedZipcode;

		fetch("http://localhost:8081/home/" + homeZipcode, {
			method: 'GET'
		}).then(res => {
			return res.json();
		}, err => {
			return console.log(err);
		}).then(zipInfo => {
			let zipInfoDivs = zipInfo.map((zip, i) => 
				<HomeRow key={i} zip={zip} />
			); 

			this.setState({
				selectedZipInfo: zipInfoDivs
			});
		});
	}

	submitCategory() {
		let category = this.state.selectedCategory;

    //get info for top zipcodes on change
    fetch('http://localhost:8081/top/' + category, {
			method: 'GET'
		}).then(res => {
			return res.json();
		}).then(topZipListObj => {
			let topZipDivs = topZipListObj.map((zip, i) =>
				<TopZipRow key={i} zip={zip} />
			);

			this.setState({
				topZips: topZipDivs
			});
		})
	}

	render() {

		return (
			<div className="Home">
				<PageNavbar active="home" />
        		<div className="container header-container">
          			<div className="jumbotron">
					  <div className="h5"><strong>Top 5 Zipcodes in Philadelphia Based On</strong></div>
						<div className="dropdown-container">
									<select value={this.state.selectedCategory} onChange={this.handleCatChange} className="dropdown" id="categoryDropdown">
										<option value="">-- select a category --</option>
										<option value="Safety">Safety</option>
										<option value="Price">Price</option>
										<option value="Schools">Schools</option>										
									</select>
									<button className="submit-btn" id="categorySubmitBtn" onClick={this.submitCategory}>Submit</button>
						</div>					  
			        	<div className="header-container">
			          		<div className="headers">
								<div className="header"><b>Zipcode: </b></div>
								<div className="header"><b>Average Home Price:</b></div>
								<div className="header"><b>Safety Score:</b></div>
								<div className="header"><b>School Rating:</b></div>
			          		</div>
						</div>	  
							<div className="results-container" id="results">
								<div className="header">{this.state.topZips}</div>
							</div>
			    	</div>
				</div>
				<div className="container header-container">
					<div className="jumbotron">
						<div className="h5"><strong>Select a Zipcode to See the Average Home Price for the Area</strong></div>
							<div className="dropdown-container">
								<select value={this.state.selectedZipcode} onChange={this.handleChange} className="dropdown" id="zipcodesDropdown">
								<option select value> -- select an option -- </option>
									{this.state.homeZipcodes}
								</select>
								<button className="submit-btn" id="zipcodesSubmitBtn" onClick={this.submitZipcode}>Submit</button>
							</div>
							<div className="bHeaders">
								<div className="bHeader"><strong>Average Price: </strong></div>
								<div className="selectedZipInfo">{this.state.selectedZipInfo}</div>
							</div>
					</div>
			    </div>
			</div>
      
		);
	}
}
