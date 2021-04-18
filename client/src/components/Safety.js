import React from 'react';
import '../style/Safety.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import SafetyRow from './SafetyRow';

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
	  <SafetyRow key={i} safety={entry}/>	 
	  );

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
        <div className="container header-container">
          <br></br>
          <div className="jumbotron less-headspace">
            <div className="header-container">
              <div className="headers">
                <div className="header"><strong>Zipcode</strong></div>
                <div className="header"><strong>Population</strong></div>
                <div className="header"><strong>Crime Count</strong></div>
				<div className="header"><strong>Crimes Per 1000 Pop.</strong></div>
                <div className="header"><strong>Positive COVID Cases</strong></div>
                <div className="header"><strong>COVID Positivity Rate</strong></div>
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