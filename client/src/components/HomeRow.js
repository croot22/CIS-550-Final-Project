import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

export default class HomeRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="home">
				<div className="Average Home Price">${this.props.zip.purchase_amount}</div>
			</div>
		);
	}
}
