import React from 'react';
import '../style/Safety.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import SafetyRow from './SafetyRow';
import { Button, Jumbotron } from 'react-bootstrap';
import { Container} from 'react-bootstrap';

export default class Schools extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      zipCodeSelected : "",
      zip_codes : []
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:8081/schoolsZipCodes",
    {
      method: 'GET' 
    }).then(res => {

      return res.json();
    }, err => {

      console.log(err);
    }).then(schoolZipCodesObj => {

      let schoolZipList = schoolZipCodesObj.map((zipCode, i) =>
      <option key = {i} value = {zipCode.zip_code}>
        {zipCode.zip_code}
        </option>
	  );

    this.setState({
        zip_codes: schoolZipList
      });

      if(schoolZipList.length > 0) {
				this.setState({
					zipCodeSelected: schoolZipCodesObj[0].zip_code
				})
			}
    }
    )
  }

  handleChange(e) {
		this.setState({
			zipCodeSelected: e.target.value
		});
	}


  render() {    
    return (

      
      <div className="Schools">
        <PageNavbar active="Schools" />
        <div className = "container school-container" >
        <Jumbotron>
      <h3 className="header">School Information by Zip code</h3>
      
      <h5 className="header">Select Zipcode from Drop Down</h5>

      <div className="dropdown-container">
			            <select value={this.state.zipCodeSelected} onChange={this.handleChange} className="dropdown" id="crimeZipcodesDropdown">
			            	{this.state.zip_codes}
			            </select>
			            <button className="submit-btn" id="crimeZipcodesSubmitBtn" onClick={this.submitZipcode}>Submit</button>
			          </div>
    </Jumbotron>
          </div>
      </div>
      

      
    );
  }
}