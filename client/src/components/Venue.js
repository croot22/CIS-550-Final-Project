import React from 'react';
import PageNavbar from './PageNavbar';
import TopZipRow from './TopZipRow';
import '../style/Venue.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Venue extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedZipcode: "",
			selectedCategory: "",
			homeZipcodes: [],
      		selectedZipInfo: [],
			topZips: []
		};
	}



	render() {

		return (
            <div className="Home">
                <PageNavbar active="Venue" />
                <div className="container header-container">
                    <div className="jumbotron less-headspace">
                        <div className="header-container">
                            <div className="headers">
                                <div className="header"><strong>Inside the Venue</strong></div>
                            </div>

                        </div>
                    </div>
                    <div class="gallery">
                        <a target="_blank" href="venue1.jpg">
                            <img src="venue1.jpg" alt="Cinque Terre" width="600" height="400"></img>
                        </a>
                        <div class="desc">Add a description of the image here</div>
                        </div>

                        <div class="gallery">
                        <a target="_blank" href="venue2.jpg">
                            <img src="venue2.jpg" alt="Forest" width="600" height="400"></img>
                        </a>
                        <div class="desc">Add a description of the image here</div>
                        </div>

                        <div class="gallery">
                        <a target="_blank" href="venue3.jpg">
                            <img src="venue3.jpg" alt="Northern Lights" width="600" height="400"></img>
                        </a>
                        <div class="desc">Add a description of the image here</div>
                    </div>
                </div>    
            </div>
		);
	}
}
