import React from 'react';
import PageNavbar from './PageNavbar';
import RecommendationsRow from './YelpRecommendationsRow';
import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class YelpRecommendations extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the selected movie name,
		// and the list of recommended movies.
		this.state = {
			movieName: "",
			recMovies: []
		}

		this.handleMovieNameChange = this.handleMovieNameChange.bind(this);
		this.submitIds = this.submitIds.bind(this);
	}

	handleMovieNameChange(e) {
		this.setState({
			movieName: e.target.value
		});
	}

	submitIds() {
		fetch("http://localhost:8081/yelp/" + this.state.movieName,
		{
			method: "GET"
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(movieList => {
			let movieDivs = movieList.map((movie, i) => 
				<RecommendationsRow key={i} movie={movie}/>
			);

			this.setState({
				recMovies: movieDivs
			});
		});
	}

	
	render() {

		return (
			<div className="YelpRecommendations">
				<PageNavbar active="yelprecommendations" />

			    <div className="container recommendations-container">
			    	<div className="jumbotron">
			    		<div className="h5"><img src="yelp-512.jpg" alt="yelp"width="100" height="50"></img> Recommendations</div>					
			    		<br></br>
			    		<div className="input-container">
			    			<input type='text' placeholder="Enter Movie Name" value={this.state.movieName} onChange={this.handleMovieNameChange} id="movieName" className="movie-input"/>
			    			<button id="submitMovieBtn" className="submit-btn" onClick={this.submitIds}>Submit</button>
			    		</div>
			    		<div className="header-container">
			    			<div className="h6">You may like ...</div>
			    			<div className="headers">
			    				<div className="header"><strong>Title</strong></div>
			    				<div className="header"><strong>Movie ID</strong></div>
					            <div className="header"><strong>Rating</strong></div>
					            <div className="header"><strong>Vote Count</strong></div>
			    			</div>
			    		</div>
			    		<div className="results-container" id="results">
			    			{this.state.recMovies}
			    		</div>
			    	</div>
			    </div>
		    </div>
		);
	}
}
