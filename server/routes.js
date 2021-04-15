var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

//Query to get overall crime stats per all zipcodes
function getAllCrime(req, res) {
  var query = `
  WITH crime_total AS(
    select distinct dc_dist, count(objectid) as crime_count
    from incidents
    GROUP BY dc_dist
    ),
 crime_breakdown AS(
    select distinct dc_dist, text_general_code, count(objectid) as crime_count
    from incidents
    GROUP BY dc_dist, text_general_code
    order by dc_dist
    ),
covid_per_zip AS(
    select covid.zipcode, count as positive_count, (count/population) as covid_positive_rate
    from covid
    join population on covid.zipcode=population.zipcode
    where result ='POS'
    ),
safety AS(
    select distinct districts.zipcode, population, sum(crime_count) as crime_count, (crime_count/population)*1000 as crimes_per_1000_pop, positive_count, covid_positive_rate 
    from crime_total
    join districts on crime_total.dc_dist=districts.dc_dist
    join population on districts.zipcode=population.zipcode
	join covid_per_zip on districts.zipcode=covid_per_zip.zipcode
    group by zipcode
    order by zipcode
    )
select *
from safety;

  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

//get crime breakdown per zipcode
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


// Yelp 1 of 2 - recommend restaurant based on category and check in 

function bestRestaurant(req, res) {
  if(!req.query.Type) {                         //look for #decade# in other file 
    res.status(400).json({
      'message': 'Incorrect query parameters passed.'
    })
  }
  var restaurant = parseInt(req.query.restaurant);  //look for #decade# in other file 
  var weekday = parseInt(req.query.weekday);    //look for #decade# in other file 
  var hour = parseInt(req.query.hour);          //look for #decade# in other file 
  var zipcode = parseInt(req.query.zipcode);    //look for #decade# in other file 

  var query = 
  `WITH BUS AS (
    SELECT business_name, address, business_id, review_count, stars, hours
    FROM yelp_business 
    WHERE zipcode = ${zipcode} AND review_count > 30 AND business_id IN
      (SELECT business_id
      FROM yelp_categories
      WHERE category = ${restaurant}) 
    ORDER BY stars DESC
    LIMIT 100
  ), op AS (
    SELECT business_id, weekday, hour, count(*)
    FROM yelp_checkin
    WHERE weekday = ${weekday} AND hour = ${hour}
    GROUP by business_id, weekday, hour
    HAVING count(*) > 2
  )
  SELECT business_name, address, stars, hours, review_content as top_review
  FROM 
    (SELECT business_name, address, review_content, BUS.stars, hours,
             ROW_NUMBER() OVER (PARTITION BY business_name
                              ORDER BY (useful+funny+cool) DESC
                             ) AS rn
    FROM yelp_review YR JOIN BUS ON YR.business_id = BUS.business_id JOIN op ON YR.business_id = op.business_id
    ) temp
  WHERE rn <= 1
  ORDER BY stars DESC LIMIT 3`; 

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

// Yelp 2 of 2 - recommend based on category and check in 

function bestPlace(req, res) {
  if(!req.query.Type) {                         //look for #decade# in other file 
    res.status(400).json({
      'message': 'Incorrect query parameters passed.'
    })
  }
  
  var weekday = parseInt(req.query.weekday);    //look for #decade# in other file 
  var hour = parseInt(req.query.hour);          //look for #decade# in other file 
  var zipcode = parseInt(req.query.zipcode);    //look for #decade# in other file 

  var query = 
  `WITH BUS AS (
      SELECT business_name, address, business_id, review_count, stars, hours
      FROM yelp_business 
      WHERE zipcode = ${zipcode} 
    ), op AS (
      SELECT business_id, weekday, hour, count(*) as volume1
      FROM yelp_checkin
      WHERE weekday = ${weekday} AND hour = ${hour}
      GROUP by business_id, weekday, hour
    )

  SELECT category, SUM(volume1) as volume
  FROM yelp_categories cat JOIN BUS ON cat.business_id = BUS.business_id JOIN op ON cat.business_id = op.business_id
  GROUP by category
  ORDER BY volume DESC 
  LIMIT 3
  `;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

//OLD BELOW:

function getAllGenres(req, res) {
  var query = `
  WITH crime_total AS(
    select distinct dc_dist, count(objectid) as crime_count
    from incidents
    GROUP BY dc_dist
    ),
 crime_breakdown AS(
    select distinct dc_dist, text_general_code, count(objectid) as crime_count
    from incidents
    GROUP BY dc_dist, text_general_code
    order by dc_dist
    ),
covid_per_zip AS(
    select covid.zipcode, count as positive_count, (count/population) as covid_positive_rate
    from covid
    join population on covid.zipcode=population.zipcode
    where result ='POS'
    ),
safety AS(
    select distinct districts.zipcode, population, sum(crime_count) as crime_count, (crime_count/population)*1000 as crimes_per_1000_pop, positive_count, covid_positive_rate 
    from crime_total
    join districts on crime_total.dc_dist=districts.dc_dist
    join population on districts.zipcode=population.zipcode
	join covid_per_zip on districts.zipcode=covid_per_zip.zipcode
    group by zipcode
    order by zipcode
    )
select *
from safety;

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
  getAllCrime: getAllCrime,

  //old exports
	getAllGenres: getAllGenres,
	getTopInGenre: getTopInGenre,
	getRecs: getRecs,
	getDecades: getDecades,
  bestGenresPerDecade: bestGenresPerDecade,
  getRandomMovies: getRandomMovies
}