import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

export default class HomeRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="home">
				<div className="Zipcode">{this.props.home.zipcode}</div>
				<div className="Average Home Price">{this.props.home.avg_price}</div>
				<div className="Overall Score">{this.props.home.score}</div>
			</div>
		);
	}
}
