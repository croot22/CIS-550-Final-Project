import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import GenreButton from './GenreButton';
import HomeRET from './HomeRow';

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of genres,
    // and a list of movies for a specified genre.
    this.state = {
      genres: [],
      movies: []
    }

    this.showMovies = this.showMovies.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/Home",
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(genreList => {
      if (!genreList) return;
      // Map each genre in this.state.genres to an HTML element:
      // A button which triggers the showMovies function for each genre.
      let genreDivs = genreList.map((genreObj, i) =>
	<GenreButton id={"button-" + genreObj.genre} onClick={() => this.showMovies(genreObj.genre)} genre={genreObj.genre} /> );

      // Set the state of the genres list to the value returned by the HTTP response from the server.
      this.setState({
        genres: genreDivs
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
  }

  showMovies(zipCode) {
    fetch("http://localhost:8081/home/" + zipCode, {
      method: "GET"
    }).then(res => {
      return res.json();
    }).then(movieList => {

      let movieDivs = movieList.map((movie, i) =>
	<HomeRET movie={movie} />);

      this.setState({
        movies: movieDivs
      })
    })
  }

  render() {    
    return (
      <div className="Home">

        <PageNavbar active="home" />

        <br></br>
        <div className="container movies-container">
          <div className="jumbotron">
            <div className="h5">Best Areas to Live in Philadelphia</div>
            <div className="genres-container">
              {this.state.genres}
            </div>
          </div>

          <br></br>
          <div className="jumbotron">
            <div className="movies-container">
              <div className="movies-header">
                <div className="header-lg"><strong>Zipcode</strong></div>
                <div className="header"><strong>Average Home Price</strong></div>
                <div className="header"><strong>Overall Score</strong></div>
              </div>
              <div className="results-container" id="results">
                {this.state.movies}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
