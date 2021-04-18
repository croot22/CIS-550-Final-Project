import React from 'react';
import '../style/Posters.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Posters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      details: null
    }
    this.showDetails = this.showDetails.bind(this);
    this.hideDetails = this.hideDetails.bind(this);
  }
//test
  componentDidMount() {
    console.log(this.props);
  }
//test
  showDetails() {
    var plot = this.props.movie.Plot.length>120 ? 
      this.props.movie.Plot.substring(0,120)+'...' : this.props.movie.Plot;
    this.setState({
      details: <div className="overlay">
      <div className="plot">{plot}</div>
      <div className="extras">
        <div className="extra rated">
          <div className="field">Rated </div>
          <div className="separater">:</div>
          <div className="value">{this.props.movie.imdbRating}</div>
        </div>
        <div className="extra boxOffice">
          <div className="field">Box Office </div>
          <div className="separater">:</div>
          <div className="value">{this.props.movie.BoxOffice}</div>
        </div>
          <div className="extra runtime">
          <div className="field">Runtime </div>
          <div className="separater">:</div>
          <div className="value">{this.props.movie.Runtime}</div>
        </div>
      </div>
    </div>
    }) 
  }

  hideDetails() {
    this.setState({
      details: null
    }) 
  }
  render() {
    var poster = <img src={this.props.movie.Poster} alt="" className="poster" />
    if(this.props.movie.Website && this.props.movie.Website!=='N/A') {
      poster = 
      <a href={this.props.movie.Website} target="_blank" className="link" onMouseOver={this.showDetails} onMouseLeave={this.hideDetails}>
        {poster}
        {this.state.details}
      </a>
    }  else {
      poster = 
      <div className='link' onMouseOver={this.showDetails} onMouseLeave={this.hideDetails}>
        {poster}
        {this.state.details}
      </div>
    }
    return (
      <div className='movie'>
        {poster}
        <div className="title">{this.props.movie.Title}</div>
      </div>
    );
  }
}

