var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

// [Safety 1 of 3] - get safety aggregate statistics for all zipcodes 
// http://localhost:8081/safety
// app.get('/safety', routes.getAllSafety);

function getAllSafety(req, res) {
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
    select distinct districts.zipcode, FORMAT(population, '#,###') as population, FORMAT(sum(crime_count), '#,###') as crime_count, FORMAT(crime_count/population*1000,'#,###') as crimes_per_1000_pop, FORMAT(positive_count, '#,###') as positive_count,  concat(round(( covid_positive_rate * 100 ),2),'%') as covid_positive_rate
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

// [Safety 2 of 3] - get crime aggregate statistics for a specific zipcode
// http://localhost:8081/totalcrime
// app.get('/totalcrime', routes.getTotalCrime);

function getTotalCrime(req, res) {
  var crimeZipcode = parseInt(req.query.crimeZipcode);

  var query = `
  WITH crime_breakdown AS(
    select distinct dc_dist, text_general_code, count(objectid) as crime_count
    from incidents
    GROUP BY dc_dist, text_general_code
    order by dc_dist
    ),
crime_breakdown_per_zip AS(
    select districts.zipcode, text_general_code, crime_count, FORMAT(crime_count/population*1000,'#,###.#') as crimes_per_1000_pop
    from crime_breakdown
    join districts on crime_breakdown.dc_dist=districts.dc_dist
    join population on districts.zipcode=population.zipcode
    group by districts.zipcode, text_general_code
    order by districts.zipcode
    )
select *
from crime_breakdown_per_zip
where zipcode='${crimeZipcode}'
order by crime_count desc;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

// [Safety 3 of 3] - get crime zipcodes 
// http://localhost:8081/zipcodeCrime
// app.get('/zipcodeCrime', routes.getZipcodeCrime);

function getZipcodeCrime(req, res) {
  var query = `
  WITH crime_breakdown AS(
    select distinct dc_dist, text_general_code, count(objectid) as crime_count
    from incidents
    GROUP BY dc_dist, text_general_code
    order by dc_dist
    ),
crime_breakdown_per_zip AS(
    select districts.zipcode, text_general_code, crime_count, (crime_count/population)*1000 as crimes_per_1000_pop
    from crime_breakdown
    join districts on crime_breakdown.dc_dist=districts.dc_dist
    join population on districts.zipcode=population.zipcode
    group by districts.zipcode, text_general_code
    order by districts.zipcode
    )
select distinct zipcode as crimeZipcode
from crime_breakdown_per_zip;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


// [Yelp] 1 of 2] - recommend restaurant based on category and check in 
// http://localhost:8081/yelp/category/bars/zipcode/15222/weekday/3/hour/5

function getBestcategory(req, res) {
  var zipcode = req.params.zipcode;    
  var category = req.params.category; 
  var weekday = req.params.weekday; 
  var hour = req.params.hour; 
  var query = `

  WITH BUS AS (
  SELECT business_name, address, business_id, review_count, stars, hours
  FROM yelp_business 
  WHERE zipcode = '${zipcode}' AND review_count > 30 AND business_id IN
    (SELECT business_id
    FROM yelp_categories
    WHERE category = '${category}') 
  ORDER BY stars DESC
  LIMIT 100
), op AS (
  SELECT business_id, weekday, hour, count(*)
    FROM yelp_checkin
    WHERE weekday = ('${weekday}'-1) AND hour = '${hour}'
    GROUP by business_id, weekday, hour
    HAVING count(*) > 2
)
SELECT business_name AS Name, address AS Address, stars AS Rating, review_content AS Review
FROM 
  (SELECT business_name, address, review_content, BUS.stars, hours,
           ROW_NUMBER() OVER (PARTITION BY business_name
                              ORDER BY (useful+funny+cool) DESC
                             ) AS rn
    FROM yelp_review YR JOIN BUS ON YR.business_id = BUS.business_id JOIN op ON YR.business_id = op.business_id
  ) temp
WHERE rn <= 1
ORDER BY stars DESC LIMIT 3


  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}


// [Yelp 2 of 2] - recommend based on category and check in 
// http://localhost:8081/yelp/zipcode/15237/weekday/5/hour/23
// app.get('/zipcode/:zipcode/weekday/:weekday/hour/:hour', routes.getBestActivity);

function getBestActivity(req, res) {
  
  var zipcode = req.params.zipcode; 
  var weekday = req.params.weekday;   
  var hour = req.params.hour;         
    
  var query = 
    `
    WITH BUS AS (
      SELECT business_name, address, business_id, review_count, stars, hours
      FROM yelp_business 
      WHERE zipcode = '${zipcode}'
    ), op AS (
      SELECT business_id, weekday, hour, count(*) as volume1
      FROM yelp_checkin
      WHERE weekday = '${weekday}' AND hour = '${hour}'
      GROUP by business_id, weekday, hour
    )

  SELECT category AS activity
  FROM yelp_categories cat JOIN BUS ON cat.business_id = BUS.business_id JOIN op ON cat.business_id = op.business_id
  GROUP by category
  ORDER BY SUM(volume1) DESC 
  LIMIT 3`
  ;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


// [Yelp Menu 1 of 4] - list out category
// http://localhost:8081/yelp/category
function getCategory(req, res) {
  var query = `
   WITH checkinByID AS (
    SELECT business_id, COUNT(*) AS freq
    FROM yelp_checkin
    GROUP BY business_id
   )
   SELECT DISTINCT category 
   FROM yelp_categories JOIN checkinByID ON yelp_categories.business_id = checkinByID.business_id
   WHERE yelp_categories.business_id IN (
    SELECT business_id
        FROM yelp_categories  
        WHERE category = 'Restaurants'
   ) AND category <> 'Restaurants' AND category <> 'Food' AND category <> 'Nightlife' AND category <> 'Bars'
   GROUP BY category
   ORDER BY sum(checkinByID.freq) DESC
   LIMIT 100
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

// [Yelp Menu 2 of 4] - list out zipcode
// http://localhost:8081/yelp/zipcode
function getZipcode(req, res) {
  var query = `
   SELECT DISTINCT zipcode 
   FROM yelp_business JOIN yelp_checkin ON yelp_business.business_id = yelp_checkin.business_id 
   WHERE yelp_business.business_id IN (
    SELECT business_id
        FROM yelp_categories  
        WHERE category = 'Restaurants'
   ) 
   GROUP BY zipcode 
   ORDER BY count(*) DESC
   LIMIT 100
    `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

// [Yelp Menu 3 of 4] - list out weekday
// http://localhost:8081/yelp/weekday
function getWeekday(req, res) {
  var query = `
   SELECT DISTINCT (weekday +1) AS weekday
   FROM yelp_checkin  
   WHERE business_id IN (
    SELECT business_id
        FROM yelp_categories  
        WHERE category = 'Restaurants'
   ) 
   GROUP BY weekday
   ORDER BY count(*) DESC
   LIMIT 100
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

// [Yelp Menu 4 of 4] - list out hour
// http://localhost:8081/yelp/hour
function getHour(req, res) {    
  var query = `
   SELECT DISTINCT hour 
   FROM yelp_checkin  
   WHERE business_id IN (
    SELECT business_id
        FROM yelp_categories  
        WHERE category = 'Restaurants'
   ) 
   GROUP BY hour
   ORDER BY count(*) DESC
   LIMIT 100
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

// [Real Estate Transfers 1/3] - get top 3 zipcodes by price, safety, yelp,etc.
// http://localhost:8081/home
//works
function getAllTransfers(req, res) {   
  var query = `
  SELECT zip_code, street_address, cash_consideration
  FROM RealEstateTransfers
  ORDER BY cash_consideration;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}


// [Real Estate Transfers 2/3] - get avg purchase amount in zipcode
// http://localhost:8081/home/zipcode
//works
function getAvgPurchasePrice(req, res) {
  var zipcode = req.params.zipcode;    
  var query = `
  SELECT zip_code, ROUND(AVG(cash_consideration), 2) AS purchase_amount
  FROM RealEstateTransfers
  WHERE zip_code = '${zipcode}';
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

// [Real Estate Transfers 3/3] - get top rated zipcodes
// http://localhost:8081/home/top
//doesn't work yet
function getTopZips(req, res) {   
  var query = `
WITH yelp AS (
    SELECT zipcode, AVG(stars) as avg_stars
    FROM yelp_business 
    GROUP BY zipcode
    ORDER BY stars DESC
    ),
crime_total AS(
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
    ),
overall_score as(
    select s.*,
    case when overall_score = 'Less than 10' 
      then 9
      else convert(overall_score, UNSIGNED INTEGER)
    end as int_overall_score
    FROM new_schema.schools s
    ),
school_score_byZip as(select zip_code, avg(int_overall_score) as average_school_score
    from overall_score
    where school_name not like ('%CLOSED%') and int_overall_score < 990
    group by zip_code
    order by 2 desc
    ),
  avg_purchase_price as(
    SELECT zip_code, AVG(cash_consideration) AS purchase_price
    FROM RealEstateTransfers r
    GROUP BY zip_code
    )
  SELECT a.zip_code AS zipcode, a.purchase_price, y.stars AS food_ratings, crimes_per_1000_pop AS safety_score, average_school_score
  FROM avg_purchase_price a
  JOIN yelp y ON a.zip_code = y.zipcode
  JOIN safety sa ON a.zip_code = ss.zipcode
  JOIN school_score ss ON a.zip_code = ss.zip_code 
  ORDER BY safety_score, average_school_score, purchase_price, food_ratings
  LIMIT 3;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

// [Schools query  1] - list average school scores by selected zip code
function getAvgScores(req, res) {
  zipcode = req.params.zipcode;    
  var query = `
  with overall_score as(
    select s.*
  , case when overall_score = 'Less than 10' 
    then 9
      else convert(overall_score, UNSIGNED INTEGER)
      end as int_overall_score
  FROM new_schema.schools s),
  averageScore AS(
    select 
  zip_code
  , avg(int_overall_score) as average_school_score
  from overall_score
  where school_name not like ('%CLOSED%') and int_overall_score < 990
  group by zip_code
  order by 2 desc)
  select *
  from averageScore
  where zip_code = '${zipcode}'
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}
//in progress
// [Schools query  2] - list average school scores by selected zip code based on grades served
function getAvgOnGradesServed(req, res) {
  zipcode = req.params.zipcode;    
  var query = `
  with overall_score as(
    select s.*
  , case when overall_score = 'Less than 10' 
    then 9
      else convert(overall_score, UNSIGNED INTEGER)
      end as int_overall_score
  FROM new_schema.schools s),
  averageScore AS(
    select 
  zip_code
  , avg(int_overall_score) as average_school_score
  from overall_score
  where school_name not like ('%CLOSED%') and int_overall_score < 990
  group by zip_code
  order by 2 desc)
  select *
  from averageScore
  where zip_code = '${zipcode}'
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

//OLD BELOW:

function getAllGenres(req, res) {
  var query = `
  select *
from covid;
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
  //safety
  getAllSafety: getAllSafety,
  getZipcodeCrime: getZipcodeCrime,
  getTotalCrime: getTotalCrime,

  // Yelp
  
  getCategory: getCategory,  
  getZipcode: getZipcode,  
  getWeekday: getWeekday,  
  getHour: getHour,  
  getBestcategory: getBestcategory,  
  getBestActivity: getBestActivity,

  // Home Page
  getAllTransfers: getAllTransfers,
  getAvgPurchasePrice: getAvgPurchasePrice,
  getTopZips: getTopZips,

  //schools
  getAvgScores: getAvgScores,

  //old exports
	getAllGenres: getAllGenres,
	getTopInGenre: getTopInGenre,
	getRecs: getRecs,
	getDecades: getDecades,
  bestGenresPerDecade: bestGenresPerDecade,
  getRandomMovies: getRandomMovies
}

