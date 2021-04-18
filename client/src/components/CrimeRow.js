import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class CrimeRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="crimeResults">
				<div className="text_general_code">{this.props.genre.text_general_code}</div>
				<div className="crime_count">{this.props.genre.crime_count}</div>
				<div className="crimes_per_1000_pop">{this.props.genre.crimes_per_1000_pop}</div>
			</div>
		);
	}
}
