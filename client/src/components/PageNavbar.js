import React from 'react';
import '../style/PageNavbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class PageNavbar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			navDivs: []
		}
	}

	componentDidMount() {
		const pageList = ['Home', 'Venue', 'Party Rentals', 'Pricing'];

		let navbarDivs = pageList.map((page, i) => {
			if (this.props.active === page) {
				return <a className="nav-item nav-link active" key={i} href={"/" + page}>{page.charAt(0).toUpperCase() + page.substring(1, page.length)}</a>
			}
			else {
				return <a className="nav-item nav-link" key={i} href={"/" + page}>{page.charAt(0).toUpperCase() + page.substring(1, page.length)}</a>
			}
		})

		this.setState({
			navDivs: navbarDivs
		});
	}

	render() {
		return (
/* 			<nav class="topnav navbar-expand-lg navbar-light navbar-custom py-3">
				<a class="navbar-brand" href="#">Santorini Rentals</a>
				<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse text-right" id="navbarNavAltMarkup">
					<div class="navbar-nav text-right">
						{this.state.navDivs}
					</div>
				</div>
			</nav> */	
			<div class="topnav">
				<a class="navbar-brand">Santorini Rentals</a>
				<div class="topnav-right">
					<a class="active" href="/home">Home</a>
					<a href="/venue">Venue</a>
					<a href="/partyrentals">Party Rentals</a>
					<a href="/pricing">Pricing</a>
				</div>
			</div>		
        );
	}
}