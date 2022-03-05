import React from 'react';
import '../style/Schools.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import SchoolRow from './SchoolRow';
import { Button, Jumbotron } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';

export default class Schools extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      zipCodeSelected: "",
      selectedGradespan: "",
      zip_codes: [],
      gradespans: [],
      defaultZip : "Select Zip Code"
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
            
          <div className="h4" ><img src="schoolratings.png" alt="school"width="100" height="75"></img> School Ratings</div>
            <h3 className="header">School Information by Zip code</h3>
            <hr className="mt-2 mb-3" />
            
            <hr className="my-1" />
            <Container>
              <Row>

              <Col> 
              <h5 className="header">Select Zip Code</h5>
              <select onChange={this.handleChange} className="dropdown" id="zipCodesDropdown">
                <option value="" selected disabled hidden> -- select zipcode -- </option>
                {this.state.zip_codes}
                
              </select>
              </Col>
              <Col>
              <h5 > Select Grade Served </h5>
              <select onChange={this.handleChangeGradespan} className="dropdown" id="zipcodesDropdown">
                <option value="" selected disabled hidden> -- select grade served -- </option>
                {this.state.gradespans}</select>
              
            </Col>

            <Col  xs lg="2">
            <Button size= "lg" className="submit-btn" id="zipCodesSubmitBtn" onClick={this.submitZipcode}>Search</Button>
             </Col>
             </Row>
            </Container>
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