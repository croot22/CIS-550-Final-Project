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

//RET
// app.get('/ret', routes.getAvgPurchasePrice);

//old code
app.get('/genres', routes.getAllGenres);
app.get('/genres/:genre', routes.getTopInGenre);
app.get('/recs/:movie', routes.getRecs);
app.get('/decades', routes.getDecades);
app.get('/bestdecade/:decade', routes.getDecades);
app.get('/bestgenre', routes.bestGenresPerDecade);
app.get('/movies/random', routes.getRandomMovies);

// yelp parameters
app.get('/yelp/category/:category', routes.getCategory); 
// the above is tested successfully with 
// http://localhost:8081/yelp/category/bars
app.get('/yelp/cusine/:cusine/zipcode/:zipcode/weekday/:weekday/hour/:hour', routes.getBestCusine); 
// the above is tested successfully with 
// http://localhost:8081/yelp/cusine/bars/zipcode/15222/weekday/3/hour/5
app.get('/yelp/zipcode/:zipcode/weekday/:weekday/hour/:hour', routes.getBestPlace);
// the above is tested successfully with 
// http://localhost:8081/yelp/zipcode/15222/weekday/5/hour/23


app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});