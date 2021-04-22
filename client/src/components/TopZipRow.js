import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

export default class TopZipRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="home">
				<div className="Zipcode">{this.props.zip.zipcode}</div>
                <div className="Average Home Price">{this.props.zip.purchase_amount}</div>
                <div className="Safety Score">{this.props.zip.safety_score}</div>
			</div>
		);
	}
}