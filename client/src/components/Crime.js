import React from 'react';
import PageNavbar from './PageNavbar';
import CrimeRow from './CrimeRow';
import '../style/Crime.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Crime extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedZipcode: "",
			crimeZipcodes: [],
			crimeCategories: []
		};
		this.submitZipcode = this.submitZipcode.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		fetch('http://localhost:8081/zipcodecrime', {
			method: 'GET'
		}).then(res => {
			return res.json();
		}).then(zipcodeListObj => {
			let zipcodeList = zipcodeListObj.map((zipcodeObj, i) =>
				<option key={i} value={zipcodeObj.crimeZipcode}>
				{zipcodeObj.crimeZipcode}
				</option>
			);

			this.setState({
				crimeZipcodes: zipcodeList,
			});

			if(zipcodeList.length > 0) {
				this.setState({
					selectedZipcode: zipcodeListObj[0].crimeZipcode
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
		let crimeZipcode = this.state.selectedZipcode;
		let url = new URL('http://localhost:8081/totalcrime/');
		let queryParams = {crimeZipcode: crimeZipcode};
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
				<PageNavbar active="Crime" />
				<div className="container crime-container">
			      <div className="jumbotron">
			        <div className="h5">Select a Zipcode for Detailed Crime Analysis</div>
			        <div className="years-container">
			          <div className="dropdown-container">
			            <select onChange={this.handleChange} className="dropdown" id="crimeZipcodesDropdown">
							<option value="" selected disabled hidden> -- select zipcode -- </option>
							{this.state.crimeZipcodes}
			            </select>
			            <button className="submit-btn" id="crimeZipcodesSubmitBtn" onClick={this.submitZipcode}>Submit</button>
			          </div>
			        </div>
			      </div>
			      <div className="jumbotron">
			        <div className="crime-container">
			          <div className="crime">
			            <div className="header-lg"><strong>Description</strong></div>
                        <div className="header"><strong>Count</strong></div>
			            <div className="header"><strong>Crimes / 1000 Pop</strong></div>
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
