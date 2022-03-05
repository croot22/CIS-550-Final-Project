import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ActivityRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="activityResults">
				<div className="Activity">{this.props.activity.activity}</div>
			</div>
		);
	}
}