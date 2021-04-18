import React from 'react';
import '../style/Safety.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';

export default class Safety extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      safety: []
    }
  }

  componentDidMount() {
    fetch("http://localhost:8081/safety",
    {
      method: 'GET' 
    }).then(res => {

      return res.json();
    }, err => {

      console.log(err);
    }).then(safetyList => {

      let safetyDivs = safetyList.map((entry, i) =>
      <div key={i} className="safety">
        <div className="zipcode">{entry.zipcode}</div>
        <div className="population">{entry.population}</div>
        <div className="crime_count">{entry.crime_count}</div>
		<div className="crimes_per_1000_pop">{entry.crimes_per_1000_pop}</div>
        <div className="positive_count">{entry.positive_count}</div>
        <div className="covid_positive_rate">{entry.covid_positive_rate}</div>
      </div>);

      this.setState({
        safety: safetyDivs
      });
    }, err => {
      console.log(err);
    });
  }


  render() {    
    return (
      <div className="Dashboard">
        <PageNavbar active="Safety" />
        <div className="container safety-container">
          <br></br>
          <div className="jumbotron less-headspace">
            <div className="safety-container">
              <div className="safety-header">
                <div className="header-lg"><strong>zipcode</strong></div>
                <div className="header"><strong>population</strong></div>
                <div className="header"><strong>crime_count</strong></div>
				<div className="header"><strong>crimes_per_1000_pop</strong></div>
                <div className="header"><strong>positive_count</strong></div>
                <div className="header"><strong>covid_positive_rate</strong></div>
              </div>
              <div className="results-container" id="results">
                {this.state.safety}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}