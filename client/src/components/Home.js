import React from 'react';
import PageNavbar from './PageNavbar';
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
	}



	render() {

		return (
			<div className="Home">
				<PageNavbar active="Home" />
				<div className="column">
					<p>Santorini</p>
					<p>Events Center</p>
				</div>
			</div>
		);
	}
}
