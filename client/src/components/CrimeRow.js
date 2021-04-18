import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class CrimeRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="movieResults">
				<div className="genre">{this.props.genre.zipcode}</div>
				<div className="rating">{this.props.genre.text_general_code}</div>
			</div>
		);
	}
}
