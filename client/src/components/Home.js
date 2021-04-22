import React from 'react';
import PageNavbar from './PageNavbar';
import HomeRow from './HomeRow';
import '../style/Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedZipcode: "",
			homeZipcodes: [],
      selectedZipInfo: [],
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
				<HomeRow zip={zip} />
			); 

			this.setState({
				selectedZipInfo: zipInfoDivs
			});
		});
	}

	render() {

		return (
			<div className="Home">
				<PageNavbar active="home" />
				<div className="container home-container">
			      <div className="jumbotron">
			        <div className="h5">Select a Zipcode to See Average Home Prices in the Area</div>
			        <div className="years-container">
			          <div className="dropdown-container">
			            <select value={this.state.selectedZipcode} onChange={this.handleChange} className="dropdown" id="homeZipcodesDropdown">
			            	{this.state.homeZipcodes}
			            </select>
			            <button className="submit-btn" id="homeZipcodesSubmitBtn" onClick={this.submitZipcode}>Submit</button>
			          </div>
			        </div>
			      </div>
			      <div className="jumbotron">
			        <div className="home-container">
			          <div className="home">
			            <div className="header-lg"><strong>Zipcode</strong></div>
                  <div className="header"><strong>Average Price</strong></div>
			          </div>
			          <div className="home-container" id="results">
			            {this.state.selectedZipInfo}
			          </div>
			        </div>
			      </div>
			    </div>
			</div>
		);
	}
}
