import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

export default class SafetyRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="safetyResults">
				<div className="zipcode">{this.props.safety.zipcode}</div>
				<div className="population">{this.props.safety.population}</div>
                <div className="crime_count">{this.props.safety.crime_count}</div>
				<div className="crimes_per_1000_pop">{this.props.safety.crimes_per_1000_pop}</div>
                <div className="positive_count">{this.props.safety.positive_count}</div>
                <div className="covid_positive_rate">{this.props.safety.covid_positive_rate}</div>
			</div>
		);
	}
}
