const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');
const app = express();
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Safety
app.get('/safety', routes.getAllSafety);
app.get('/zipcodeCrime', routes.getZipcodeCrime);
app.get('/totalcrime', routes.getTotalCrime);

//Home Page
app.get('/home', routes.getAllTransfers); 
app.get('/home/zipcodes', routes.getZipcodes);
app.get('/home/:zipcode', routes.getAvgPurchasePrice); 
app.get('/home/top', routes.getTopZips); 

// yelp drop down menu
app.get('/yelp/category', routes.getCategory); //http://localhost:8081/yelp/category
app.get('/yelp/zipcode', routes.getZipcode); //http://localhost:8081/yelp/zipcode
app.get('/yelp/weekday', routes.getWeekday); //http://localhost:8081/yelp/weekday
app.get('/yelp/hour', routes.getHour); //http://localhost:8081/yelp/hour
// yelp request 
app.get('/yelp/zipcode/:zipcode/weekday/:weekday/hour/:hour/category/:category', routes.getBestcategory); 
// the above is tested successfully with 
// http://localhost:8081/yelp/zipcode/15222/weekday/3/hour/5/category/bars
app.get('/yelp/zipcode/:zipcode/weekday/:weekday/hour/:hour', routes.getBestActivity);
// the above is tested successfully with 
// http://localhost:8081/yelp/zipcode/15222/weekday/5/hour/23

//old code
app.get('/genres', routes.getAllGenres);
app.get('/genres/:genre', routes.getTopInGenre);
app.get('/recs/:movie', routes.getRecs);
app.get('/decades', routes.getDecades);
app.get('/bestdecade/:decade', routes.getDecades);
app.get('/bestgenre', routes.bestGenresPerDecade);
app.get('/movies/random', routes.getRandomMovies);

//school parameters
//works using http://localhost:8081/schools/19104/
app.get('/schools/:zipcode', routes.getAvgScores);

//In progress
//app.get('/schools/:zipcode', routes.getAvgOnGradesServed);

//Port parameter
app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});