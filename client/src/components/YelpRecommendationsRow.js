import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class RecommendationsRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="restaurantResults">
				<div className="Name">{this.props.restaurant.Name}</div>
				<div className="Address">{this.props.restaurant.Address}</div>
				<div className="Rating">{this.props.restaurant.Rating}</div>
				<div className="Review">{this.props.restaurant.Review}</div>
			</div>
		);
	}
}
