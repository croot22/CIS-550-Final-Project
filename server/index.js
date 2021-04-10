const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/genres', routes.getAllGenres);
app.get('/genres/:genre', routes.getTopInGenre);
app.get('/recs/:movie', routes.getRecs);
app.get('/decades', routes.getDecades);
app.get('/bestdecade/:decade', routes.getDecades);
app.get('/bestgenre', routes.bestGenresPerDecade);
app.get('/movies/random', routes.getRandomMovies);

app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});