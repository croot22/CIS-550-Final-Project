import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

export default class HomeRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="movie">
				<div className="Zipcode">{this.props.movie.title}</div>
				<div className="Average Home Price">{this.props.movie.rating}</div>
				<div className="Overall Score">{this.props.movie.vote_count}</div>
			</div>
		);
	}
}
