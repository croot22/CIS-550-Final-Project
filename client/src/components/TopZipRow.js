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
                <div className="Price">${this.props.zip.Price}</div>
                <div className="Safety">{this.props.zip.Safety}</div>
                <div className="Schools">{this.props.zip.Schools}</div>
			</div>
		);
	}
}