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
  WITH dist_select AS(
    select dc_dist, zipcode
    from districts
    where zipcode='${crimeZipcode}'
    ),
crime_breakdown AS(
    select dist_select.zipcode, text_general_code, count(objectid) as crime_count, population
    from incidents
    join dist_select on incidents.dc_dist=dist_select.dc_dist
    join population on dist_select.zipcode=population.zipcode
    GROUP BY dist_select.dc_dist, text_general_code
    order by crime_count desc
    )
select zipcode, text_general_code, crime_count, FORMAT(crime_count/population*1000,'#,###.#') as crimes_per_1000_pop
from crime_breakdown;
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
    SELECT business_name, address, business_id, review_count, stars
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
  (SELECT business_name, address, review_content, BUS.stars,
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
      SELECT business_name, address, business_id, review_count, stars
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
  WHERE category <> ' Restaurants' AND category <> ' Food'
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

  SELECT DISTINCT category 
  FROM restaurantID rID LEFT JOIN yelp_categories cat ON rID.business_id = cat.business_id 
  WHERE category <> 'Restaurants' 
  GROUP BY category
  ORDER BY count(rID.business_id) DESC
  LIMIT 50

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
  FROM restaurantID rID JOIN yelp_business b ON rID.business_id = b.business_id
  GROUP BY zipcode
  ORDER BY count(rID.business_id) DESC
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
   ORDER BY count(business_id) DESC
   LIMIT 100;
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
   ORDER BY count(business_id) DESC
   LIMIT 100;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

// [Real Estate Transfers 1/4] - get top 3 zipcodes by price, safety, yelp,etc.
// http://localhost:8081/home
function getAllTransfers(req, res) {   
  var query = `
  SELECT zip_code, street_address, cash_consideration
  FROM RealEstateTransfers
  ORDER BY cash_consideration
  Limit 3;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

// [Real Estate Transfers 2/4] - get zipcodes for dropdown.
// http://localhost:8081/home/zipcodes
function getZipcodes(req, res) {   
  var query = `
  SELECT DISTINCT zip_code AS zipcode
  FROM RealEstateTransfers
  ORDER BY zip_code;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

// [Real Estate Transfers 3/4] - get avg purchase amount in zipcode
// http://localhost:8081/home/zipcode
function getAvgPurchasePrice(req, res) {
  var zipcode = req.params.zipcode;    
  var query = `
  SELECT zip_code, FORMAT(AVG(cash_consideration), 'C2') AS purchase_amount
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

// [Real Estate Transfers 4/4] - get top rated zipcodes
// http://localhost:8081/top/:category
//doesn't work yet
function getTopZips(req, res) {   
  var category = req.params.category;
  var query = `
WITH crime_total AS(
    select distinct dc_dist, count(objectid) as crime_count
    from incidents
    GROUP BY dc_dist
    ),
covid_per_zip AS(
    select covid.zipcode, count as positive_count, (count/population) as covid_positive_rate
    from covid
    join population on covid.zipcode=population.zipcode
    where result ='POS'
    ),
safety AS(
    select distinct districts.zipcode, population, sum(crime_count) as crime_count, (1/((crime_count/population)*1000))*100 + (1/(covid_positive_rate))*10 as safety_score 
    from crime_total
    join districts on crime_total.dc_dist=districts.dc_dist
    join population on districts.zipcode=population.zipcode
	  join covid_per_zip on districts.zipcode=covid_per_zip.zipcode
    group by zipcode
    ),
  avg_purchase_price as(
    SELECT zip_code, AVG(cash_consideration) AS purchase_price
    FROM RealEstateTransfers r
    GROUP BY zip_code
    ),
  overall_score as(
      select s.*,
      case when overall_score = 'Less than 10' 
      then 9
        else convert(overall_score, UNSIGNED INTEGER)
        end as int_overall_score
    FROM new_schema.schools s
    ),
    averageScore AS(
      select zip_code, 
      avg(int_overall_score) as average_school_score
      from overall_score
      where school_name not like ('%CLOSED%') and int_overall_score < 990
      group by zip_code
    )
  SELECT DISTINCT a.zip_code AS zipcode, FORMAT(a.purchase_price, 'C2') AS Price, IFNULL(ROUND(safety_score,0), 0) AS Safety, IFNULL(ROUND(average_school_score,0), 0) AS Schools
  FROM avg_purchase_price a
  JOIN safety ON a.zip_code = safety.zipcode
  JOIN averageScore ON a.zip_code = averageScore.zip_code
  
  ORDER BY ${category} DESC
  LIMIT 5;
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

// get school zip codes
function getSchoolZipcodes(req, res) {  
  var query = `
  with overall_score as(
    select s.*
  , case when overall_score = 'Less than 10' 
    then 9
      else convert(overall_score, UNSIGNED INTEGER)
      end as int_overall_score
  FROM new_schema.schools s)
  select distinct  
  zip_code
  from overall_score
  where school_name not like ('%CLOSED%') and int_overall_score < 990
  order by zip_code
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

// get school zip codes
function getSchoolGrades(req, res) {  
  var query = `
  with overall_score as(
    select school_name, website, street_address, overall_score,overall_city_rank,
 prog_score, admissions_category, zip_code
 , gradespan
 , case when overall_score = 'Less than 10' 
   then 9
     else convert(overall_score, UNSIGNED INTEGER)
     end as int_overall_score
 FROM new_schema.schools s
 union
select school_name, website, street_address, overall_score,overall_city_rank,
 prog_score, admissions_category, zip_code
 , "0-All" as gradespan
 , case when overall_score = 'Less than 10' 
   then 9
     else convert(overall_score, UNSIGNED INTEGER)
     end as int_overall_score
 FROM new_schema.schools s)
 select distinct gradespan
 from overall_score
 where school_name not like ('%CLOSED%') and int_overall_score < 990
  order by gradespan
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}


function getSchoolInformation(req, res) {  
  zip_code = req.params.zip_code; 
  gradespan = req.params.gradespan; 


  var query = `
  with overall_score as(
    select school_name, website, street_address, overall_score,overall_city_rank,
 prog_score, admissions_category, zip_code
 , gradespan
 , case when overall_score = 'Less than 10' 
   then 9
     else convert(overall_score, UNSIGNED INTEGER)
     end as int_overall_score
 FROM new_schema.schools s
 union
select school_name, website, street_address, overall_score,overall_city_rank,
 prog_score, admissions_category, zip_code
 , "0-All" as gradespan
 , case when overall_score = 'Less than 10' 
   then 9
     else convert(overall_score, UNSIGNED INTEGER)
     end as int_overall_score
 FROM new_schema.schools s)
 select school_name, website, street_address, overall_score,overall_city_rank,
 prog_score, admissions_category, zip_code
 from overall_score
 where school_name not like ('%CLOSED%') and int_overall_score < 990
  and zip_code = "${zip_code}"
  and gradespan = "${gradespan}"
  order by int_overall_score desc;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}


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
  getZipcodes: getZipcodes,
  getAvgPurchasePrice: getAvgPurchasePrice,
  getTopZips: getTopZips,

  //schools
  getAvgScores: getAvgScores,
  getSchoolZipcodes: getSchoolZipcodes,
  getSchoolGrades: getSchoolGrades,
  getSchoolInformation: getSchoolInformation,

}

