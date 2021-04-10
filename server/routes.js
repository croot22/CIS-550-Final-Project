var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

function getAllGenres(req, res) {
  var query = `
    SELECT *
    FROM covid;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getTopInGenre(req, res) {
  var genre = req.params.genre;

  var query = `
    SELECT M.title, M.rating, M.vote_count
    FROM Movies M
    RIGHT JOIN Genres G
    ON M.id = G.movie_id
    WHERE G.genre = '${genre}'
    ORDER BY M.rating DESC, M.vote_count DESC
    LIMIT 10;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getRecs(req, res) {
  var movie_name = req.params.movie;

  var query = `
    WITH inputGenres (genre) AS (
      SELECT g.genre
      FROM Movies m JOIN Genres g ON m.id=g.movie_id
      WHERE m.title='${movie_name}'
    ), recommendedMovies (id) AS (
      SELECT DISTINCT movie_id  AS id
      FROM Genres g1 JOIN inputGenres g2
      ON g1.genre = g2.genre
      GROUP BY movie_id
      HAVING count(g1.genre)=(select count(*) from inputGenres)
    )
    SELECT m.title, m.id, m.rating, m.vote_count
    FROM recommendedMovies rm JOIN Movies m ON rm.id=m.id
    WHERE m.id <> (SELECT id FROM Movies WHERE title='${movie_name}')
    ORDER BY m.rating DESC, m.vote_count DESC LIMIT 5;
  `;

  connection.query(query, function(err, rows, fieldds) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getDecades(req, res) {
	var query = `
    SELECT DISTINCT (FLOOR(year/10)*10) AS decade
    FROM (
      SELECT DISTINCT release_year as year
      FROM Movies
      ORDER BY release_year
    ) y
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function bestGenresPerDecade(req, res) {
  if(!req.query.decade) {
    res.status(400).json({
      'message': 'Incorrect query parameters passed.'
    })
  }
  var decade = parseInt(req.query.decade);
  var query = `
  WITH AvgGenreRatings AS (
    SELECT Genre, AVG(rating) AS AvgRating 
    FROM Movies m JOIN Genres g ON m.id=g.movie_id 
    WHERE release_year>=${decade} and release_year<${decade+10}
    GROUP BY genre)
  SELECT * FROM 
  (   
    (SELECT * FROM AvgGenreRatings) 
    UNION 
    (SELECT genre, 0 FROM Genres where genre NOT IN (SELECT DISTINCT genre FROM AvgGenreRatings))
  ) allGenres
  ORDER BY AvgRating DESC, Genre;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getRandomMovies(req, res) {
  var n_movies = req.query.num || 8;
  var moviesQuery = `SELECT imdb_id FROM Movies m ORDER BY RAND() LIMIT ${n_movies}`;
  connection.query(moviesQuery, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

module.exports = {
	getAllGenres: getAllGenres,
	getTopInGenre: getTopInGenre,
	getRecs: getRecs,
	getDecades: getDecades,
  bestGenresPerDecade: bestGenresPerDecade,
  getRandomMovies: getRandomMovies
}