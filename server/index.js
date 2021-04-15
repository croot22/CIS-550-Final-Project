const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:8081/genres'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//safety
app.get('/safety', routes.getAllSafety);
app.get('/crime', routes.getAllCrime);
app.get('/covid', routes.getAllCovid);
app.get('/safety/:zipcodeSafety', routes.getSafetyPerZip);
app.get('/crime/:zipcodeCrime', routes.getCrimePerZip);

//old code
app.get('/genres', routes.getAllGenres);
app.get('/genres/:genre', routes.getTopInGenre);
app.get('/recs/:movie', routes.getRecs);
app.get('/decades', routes.getDecades);
app.get('/bestdecade/:decade', routes.getDecades);
app.get('/bestgenre', routes.bestGenresPerDecade);
app.get('/movies/random', routes.getRandomMovies);

// yelp parameters
app.get('/yelp/category/:category', routes.getCategory); //running 
app.get('/yelp/restaurant', routes.getBestRestaurant);
//app.get('/yelp/zipcode/:zipcode/restaurant/:restaurant/weekday/:weekday/hour/:hour', routes.getBestRestaurant);
app.get('/yelp/zipcode/:zipcode/weekday/:weekday/hour/:hour', routes.getBestPlace);

app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});