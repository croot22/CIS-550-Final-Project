import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class SchoolRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div  className="schoolResults">
				<div className="school_name">{this.props.school.school_name}</div>
				<div className="website">{this.props.school.website}</div>
                <div className="overall_score">{this.props.school.overall_score}</div>
                <div className="overall_city_rank">{this.props.school.overall_city_rank}</div>
                <div className="prog_score">{this.props.school.prog_score}</div>
                <div className="admissions_category">{this.props.school.admissions_category}</div>
			</div>
		);
	}
}
