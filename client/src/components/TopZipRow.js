import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

export default class TopZipRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="topZipResults">
				<div className="zipcode">{this.props.zip.zipcode}</div>
                <div className="price">${this.props.zip.price}</div>
                <div className="safety_score">{this.props.zip.safety_score}</div>
                <div className="school_avg">{this.props.zip.school_avg}</div>
			</div>
		);
	}
}