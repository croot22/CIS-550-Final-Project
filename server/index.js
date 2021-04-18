const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

//app.use(cors({credentials: true, origin: 'http://localhost:8081/genres'}));
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//safety
app.get('/safety', routes.getAllSafety);
app.get('/crime', routes.getAllCrime);
app.get('/covid', routes.getAllCovid);
app.get('/safety/:zipcodeSafety', routes.getSafetyPerZip);
app.get('/crime/:zipcodeCrime', routes.getCrimePerZip);

//Home Page
app.get('/home', routes.getAllTransfers); //works
app.get('/home/:zipcode', routes.getAvgPurchasePrice); //works
app.get('/home/top', routes.getTopZips); //not yet

// yelp drop down menu
app.get('/yelp/category', routes.getCategory); //http://localhost:8081/yelp/category
app.get('/yelp/zipcode', routes.getZipcode); //http://localhost:8081/yelp/zipcode
app.get('/yelp/weekday', routes.getWeekday); //http://localhost:8081/yelp/weekday
app.get('/yelp/hour', routes.getHour); //http://localhost:8081/yelp/hour
// yelp request 
app.get('/yelp/cusine/:cusine/zipcode/:zipcode/weekday/:weekday/hour/:hour', routes.getBestCusine); 
// the above is tested successfully with 
// http://localhost:8081/yelp/cusine/bars/zipcode/15222/weekday/3/hour/5
app.get('/yelp/zipcode/:zipcode/weekday/:weekday/hour/:hour', routes.getBestPlace);
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