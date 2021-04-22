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
			homeZipcodes: [],
      selectedZipInfo: [],
			topZips: []
		};
		this.submitZipcode = this.submitZipcode.bind(this);
		this.handleChange = this.handleChange.bind(this);
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

    //get info for top zipcodes
    fetch('http://localhost:8081/top/safety_score', {
			method: 'GET'
		}).then(res => {
			return res.json();
		}).then(topZipListObj => {
			let topZipList = topZipListObj.map((zip, i) =>
				<TopZipRow key={i} zip={zip} />
			);

			this.setState({
				topZips: topZipList,
			});
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
				<HomeRow key={i} zip={zip} />
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
        <div className="container total-container">
          <div className="jumbotron">
			        <div className="total-container">
			          <div className="total">
                  <div className="header">Zipcode: </div>
                  <div className="header">Average Purchase Price:</div>
                  <div className="header">Safety Score:</div>
			          </div>
			          <div className="total-container" id="results">
			            {this.state.crimeCategories}
			          </div>
			        </div>
			    </div>
        </div>
				<div className="container home-container">
			      <div className="jumbotron">
			        <div className="h5"><strong>Select a Zipcode to See Average Home Prices in the Area</strong></div>
			        <div className="years-container">
			          <div className="dropdown-container">
			            <select value={this.state.selectedZipcode} onChange={this.handleChange} className="dropdown" id="zipcodesDropdown">
			            	{this.state.homeZipcodes}
			            </select>
			            <button className="submit-btn" id="zipcodesSubmitBtn" onClick={this.submitZipcode}>Submit</button>
			          </div>
                <div className="headers">
                  <div className="header"><strong>Average Price: </strong></div>
                  <div className="selectedZipInfo">{this.state.selectedZipInfo}</div>
                </div>
              </div>  
			      </div>
			    </div>
			</div>
      
		);
	}
}
