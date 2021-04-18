import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import GenreButton from './GenreButton';
import SafetyRow from './SafetyRow';

export default class Safety extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of safety,
    // and a list of safety for a specified genre.
    this.state = {
      safety: []
    }

    this.showSafety = this.showSafety.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/safety",
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(safetyList => {
      if (!safetyList) return;
      // Map each genre in this.state.safety to an HTML element:
      // A button which triggers the showSafety function for each genre.
      let safetyDivs = safetyList.map((safetyObj, i) =>
	<GenreButton id={"button-" + safetyObj.safety} onClick={() => this.showSafety(safetyObj.safety)} safety={safetyObj.safety} /> );

      // Set the state of the safety list to the value returned by the HTTP response from the server.
      this.setState({
        safety: safetyDivs
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
  }

  showSafety(zipCode) {
    fetch("http://localhost:8081/safety/" + zipCode, {
      method: "GET"
    }).then(res => {
      return res.json();
    }).then(safetyList => {

      let safetyDivs = safetyList.map((safety, i) =>
	<SafetyRow safety={safety} />);

      this.setState({
        safety: safetyDivs
      })
    })
  }

  render() {    
    return (
      <div className="Home">
        <PageNavbar active="home" />
        <br></br>
        <div className="container safety-container">
          <div className="jumbotron">
            <div className="h5">Safety Metrics for Philadelphia</div>
            <div className="safety-container">
              {this.state.safety}
            </div>
          </div>

          <br></br>
          <div className="jumbotron">
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
