import React from 'react';
import PageNavbar from './PageNavbar';
import CrimeRow from './HomeRow';
import '../style/Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedZipcode: "",
			homeZipcodes: [],
			zipScores: []
		};
		this.submitZipcode = this.submitZipcode.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		fetch('http://localhost:8081/home/zipcodes', {
			method: 'GET'
		}).then(res => {
			return res.json();
		}).then(zipcodeListObj => {
			let zipcodeList = zipcodeListObj.map((zipcodeObj, i) =>
				<option key={i} value={zipcodeObj.homeZipcode}>
				{zipcodeObj.homeZipcode}
				</option>
			);

			this.setState({
				homeZipcodes: zipcodeList,
			});

			if(zipcodeList.length > 0) {
				this.setState({
					selectedZipcode: zipcodeListObj[0].homeZipcode
				})
			}
		})
	}

	handleChange(e) {
		this.setState({
			selectedZipcode: e.target.value
		});
	}

	submitZipcode() {
		let homeZipcode = this.state.selectedZipcode;
		let url = new URL('http://localhost:8081/home/');
		let queryParams = {homeZipcode: homeZipcode};
		//If there are more than one query parameters, this is useful.
		Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));
		fetch(url, {
			method: 'GET'
		}).then(res => {
			return res.json();
		}, err => {
			return console.log(err);
		}).then(crimeList => {
			let totalCrimeDivs = crimeList.map((crime, i) => 
				<CrimeRow crime={crime} />
			); 

			this.setState({
				crimeCategories: totalCrimeDivs
			});
		});
	}

	render() {

		return (
			<div className="Crime">
				<PageNavbar active="crime" />
				<div className="container crime-container">
			      <div className="jumbotron">
			        <div className="h5">Select a Zipcode to See Average Home Prices in the Area</div>
			        <div className="years-container">
			          <div className="dropdown-container">
			            <select value={this.state.selectedZipcode} onChange={this.handleChange} className="dropdown" id="homeZipcodesDropdown">
			            	{this.state.homeZipcodes}
			            </select>
			            <button className="submit-btn" id="crimeZipcodesSubmitBtn" onClick={this.submitZipcode}>Submit</button>
			          </div>
			        </div>
			      </div>
			      <div className="jumbotron">
			        <div className="crime-container">
			          <div className="crime">
			            <div className="header-lg"><strong>Zipcode</strong></div>
                  <div className="header"><strong>Average Price</strong></div>
			          </div>
			          <div className="crime-container" id="results">
			            {this.state.crimeCategories}
			          </div>
			        </div>
			      </div>
			    </div>
			</div>
		);
	}
}
