import React from 'react';
import '../style/Schools.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import SchoolRow from './SchoolRow';
import { Button, Jumbotron } from 'react-bootstrap';
import { Container } from 'react-bootstrap';

export default class Schools extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      zipCodeSelected: "",
      selectedGradespan: "",
      zip_codes: [],
      gradespans: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeGradespan = this.handleChangeGradespan.bind(this);
    this.submitZipcode = this.submitZipcode.bind(this);

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
          <option key={i} value={zipCode.zip_code}>
            {zipCode.zip_code}
          </option>
        );

        this.setState({
          zip_codes: schoolZipList
        });

        if (schoolZipList.length > 0) {
          this.setState({
            zipCodeSelected: schoolZipCodesObj[0].zip_code
          })
        }
      }
      )

    fetch('http://localhost:8081/schoolsGrades', {
      method: 'GET'
    }).then(res => {
      return res.json();
    }).then(categoryListObj => {

      let categoryList = categoryListObj.map((categoryObj, i) =>
        <option key={i} value={categoryObj.gradespan}>
          {categoryObj.gradespan}
        </option>
      );//...

      this.setState({
        gradespans: categoryList,
      });

      if (categoryList.length > 0) {
        this.setState({
          selectedGradespan: categoryListObj[0].gradespan
        })
      }
    })
  }

  handleChange(e) {
    this.setState({
      zipCodeSelected: e.target.value
    });
  }

  handleChangeGradespan(e) {
    this.setState({
      selectedGradespan: e.target.value
    });
  }

  submitZipcode() {
    let zipcode = this.state.zipCodeSelected;
    let gradespan = this.state.selectedGradespan;
    fetch("http://localhost:8081/schoolInformation/zip_code/" + this.state.zipCodeSelected + "/gradespan/" + this.state.selectedGradespan,
      {
        method: "GET"
      }).then(res => {
        console.log(res);
        return res.json();

      }, err => {
        console.log(err);
      }).then(schoolList => {
        let schoolDivs = schoolList.map((entry, i) =>
          <SchoolRow key={i} school={entry} />
        );

        this.setState({
          recSchools: schoolDivs
        });
      });
  }


  render() {
    return (


      <div className="Schools">
        <PageNavbar active="Schools" />
        <div className="container school-container" >
          <Jumbotron>
            <h3 className="header">School Information by Zip code</h3>
            <hr className="mt-2 mb-3" />
            <h6 className="header">Select Zipcode and Grade Served</h6>
            <hr className="my-1" />
            <div className="dropdown-container">
              <select value={this.state.zipCodeSelected} onChange={this.handleChange} className="dropdown" id="zipCodesDropdown">
                {this.state.zip_codes}
              </select>
              <select value={this.state.selectedGradespan} onChange={this.handleChangeGradespan} className="dropdown" id="zipcodesDropdown">
                {this.state.gradespans}</select>
              <button className="submit-btn" id="zipCodesSubmitBtn" onClick={this.submitZipcode}>Search</button>
            </div>
          </Jumbotron>

          <Jumbotron>
            <div className="h6"> Top schools ranked by overall score</div>
            <hr className="my-2" />
            <div className="header-container">
               <div className="headers">
                <div className="header"><strong>School Name      </strong></div>
                <div className="header"><strong>Website</strong></div>
                <div className="header"><strong>Overall Score</strong></div>
                <div className="header"><strong>City Rank</strong></div>
                <div className="header"><strong>Program Score</strong></div>
                <div className="header"><strong>Admission Category</strong></div>

              </div>
              </div>
            
            <div className="results-container" id="results">
              {this.state.recSchools}
              </div>
            
            </Jumbotron>
        </div>
      </div>



    );
  }
}