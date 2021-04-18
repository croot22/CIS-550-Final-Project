import React from 'react';
import '../style/Posters.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import Poster from './Poster';
import Schools from './Schools';
export default class Posters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      movies: []
    }

    this.apiConfig = {
      omdb: {
        //TODO: change key to your omdb api key here
        key:"<youromdbapikey>",
        uri:"http://www.omdbapi.com/"
      }
    }
  }

  componentDidMount() {
    fetch("http://localhost:8081/movies/random",
    {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(moviesList => {
      moviesList.forEach((movieObj, i) => {
        let url = new URL(this.apiConfig.omdb.uri);
        let params = {
          apiKey: this.apiConfig.omdb.key,
          i: movieObj.imdb_id
        }
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        fetch(url, {
          method: 'GET',
        }).then((res) => {
          return res.json(); 
        }, err => {
          console.log(err);
        }).then(omdbMovieData => {
          var movies = this.state.movies;
          movies.push(<Poster key={i} movie={omdbMovieData}></Poster>);
          this.setState({movies: movies});
        });
      });
    }, err => {
      console.log(err);
    });
  }

  render() {    
    return (
      <div className="Posters">

        <PageNavbar active="posters" />

        <br></br>
        <div className="container posters-container">
          <div className="jumbotron">
            <div className="movies-container">
              {this.state.movies}
            </div>
          </div>
        </div>
      </div>
    );
  }
}