import React from 'react';
import PageNavbar from './PageNavbar';
import TopZipRow from './TopZipRow';
import '../style/Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class PartyRentals extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedZipcode: "",
			selectedCategory: "",
			homeZipcodes: [],
      		selectedZipInfo: [],
			topZips: []
		};
	}



	render() {

		return (
			<div className="Home">
				<PageNavbar active="Party Rentals" />
				<div className="column">
					<p>Santorini</p>
					<p>Events Center</p>
				</div>
			</div>
		);
	}
}
