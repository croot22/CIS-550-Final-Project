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
				<div className="column">
					<p>Santorini</p>
					<p>Events Center</p>
				</div>
			</div>
		);
	}
}
