import React from 'react';
import PageNavbar from './PageNavbar';
import BestGenreRow from './BestGenreRow';
import '../style/BestGenres.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BestGenre extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedDecade: "",
			decades: [],
			genres: []
		};

		this.submitDecade = this.submitDecade.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		fetch('http://localhost:8081/decades', {
			method: 'GET'
		}).then(res => {
			return res.json();
		}).then(decadeListObj => {

			let decadeList = decadeListObj.map((decadeObj, i) =>
				<option key={i} value={decadeObj.decade}>
				{decadeObj.decade}
				</option>
			);

			this.setState({
				decades: decadeList,
			});

			if(decadeList.length > 0) {
				this.setState({
					selectedDecade: decadeListObj[0].decade
				})
			}
		})
	}

	handleChange(e) {
		this.setState({
			selectedDecade: e.target.value
		});
	}

	submitDecade() {
		let decade = this.state.selectedDecade;
		let url = new URL('http://localhost:8081/bestgenre/');
		let queryParams = {decade: decade};
		//If there are more than one query parameters, this is useful.
		Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));
		fetch(url, {
			method: 'GET'
		}).then(res => {
			return res.json();
		}, err => {
			return console.log(err);
		}).then(genreList => {
			let bestGenreDivs = genreList.map((genre, i) => 
				<BestGenreRow genre={genre} />
			); 

			this.setState({
				genres: bestGenreDivs
			});
		});
	}

	render() {

		return (
			<div className="BestGenres">
				<PageNavbar active="bestgenres" />

				<div className="container bestgenres-container">
			      <div className="jumbotron">
			        <div className="h5">Best Genres</div>

			        <div className="years-container">
			          <div className="dropdown-container">
			            <select value={this.state.selectedDecade} onChange={this.handleChange} className="dropdown" id="decadesDropdown">
			            	{this.state.decades}
			            </select>
			            <button className="submit-btn" id="decadesSubmitBtn" onClick={this.submitDecade}>Submit</button>
			          </div>
			        </div>
			      </div>
			      <div className="jumbotron">
			        <div className="movies-container">
			          <div className="movie">
			            <div className="header"><strong>Genre</strong></div>
			            <div className="header"><strong>Average Rating</strong></div>
			          </div>
			          <div className="movies-container" id="results">
			            {this.state.genres}
			          </div>
			        </div>
			      </div>
			    </div>
			</div>
		);
	}
}
