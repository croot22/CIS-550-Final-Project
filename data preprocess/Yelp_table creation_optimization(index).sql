
# Table initialization

# business 

CREATE TABLE yelp_business (
                               rowN integer,  # droped later
                               business_id text, 
                               business_name text,
                               address text, 
                               city text, 
                               state varchar(2),
                               zipcode int,
                               latitude float, # droped later
                               longitude float, # droped later
                               stars double,
                               review_count int,
                               is_open int,
                               attributes text, # droped later
                               categories text, # Yelp_categories is a standalong table from this field
                               hours text # droped later
                               );

ALTER TABLE yelp_business RENAME COLUMN postal_code to zipcode;

LOAD DATA LOCAL INFILE '/Users/JasmineJian/Downloads/yelp_business_Phili2 (1).csv' INTO TABLE yelp_business
  FIELDS TERMINATED BY ','  
  OPTIONALLY ENCLOSED BY '"'
  LINES TERMINATED BY '\n' 
  IGNORE 1 LINES
  ;

# review 

CREATE TABLE yelp_review (
                               rowN integer, # droped later
                               review_id text, 
                               user_id text, # droped later
                               business_id text,
                               stars double, 
                               useful int, 
                               funny int,
                               cool int,
                               review_content text,
                               calendar_year year, # droped later
                               calendar_month int, # droped later
                               calendar_day int, # droped later
                               week_day int, # droped later
                               reviewhour int # droped later
                               );

LOAD DATA LOCAL INFILE '/Users/JasmineJian/Downloads/yelp_data_3.31/yelp_review_Phili2 (1).csv' INTO TABLE yelp_review
  FIELDS TERMINATED BY ','  
  OPTIONALLY ENCLOSED BY '"'
  LINES TERMINATED BY '\n' 
  IGNORE 1 LINES
  ;

# checkin

CREATE TABLE yelp_checkin (
                               rowN int, # droped later
                               business_id text, 
                               date text, # droped later
                               weekday int, 
                               hour int
                               );

LOAD DATA LOCAL INFILE '/Users/JasmineJian/Downloads/yelp_checkin_Phili2 (1).csv' INTO TABLE yelp_checkin
  FIELDS TERMINATED BY ','  LINES TERMINATED BY '\n' 
  IGNORE 1 LINES
  ;

SELECT * FROM yelp_checkin;
SELECT COUNT(*) FROM yelp_checkin;

# business categories

CREATE TABLE yelp_categories (
                               rowN int, # droped later
                               business_id text, 
                               category text
                               );

LOAD DATA LOCAL INFILE '/Users/JasmineJian/Downloads/yelp_categories_Phili2 (1).csv' INTO TABLE yelp_categories
  FIELDS TERMINATED BY ','  LINES TERMINATED BY '\n' 
  IGNORE 1 LINES
  ;
  
SELECT COUNT(*) FROM yelp_categories;

SET SQL_SAFE_UPDATES = 0;

Update yelp_categories 
SET category = SUBSTRING(category,2,255) 
WHERE category LIKE ' %';


# Optimization - added index and sort table based on foreign key it references to 

CREATE INDEX bid ON yelp_categories(business_id(50) ASC);
CREATE INDEX bid ON yelp_review(business_id(50) ASC);
CREATE INDEX bid ON yelp_checkin(business_id(50) ASC);
CREATE INDEX wd ON yelp_checkin(weekday ASC, hour ASC, business_ID(50));
CREATE INDEX zd ON yelp_business(zipcode ASC, business_ID(50));
CREATE INDEX cat ON yelp_categories(category(50) ASC, business_id(50) ASC);

ALTER TABLE yelp_categories ORDER BY business_id ASC;
ALTER TABLE yelp_business ORDER BY business_id ASC;
ALTER TABLE yelp_checkin ORDER BY business_id ASC;
ALTER TABLE yelp_review ORDER BY business_id ASC;

# Added materialized view for common query (what bid is a restaurant)

CREATE VIEW rID AS
SELECT business_id FROM yelp_categories
WHERE category = 'Restaurants';

CREATE VIEW restaurantID AS 
SELECT rID.business_id
FROM rID LEFT JOIN yelp_categories ON rID.business_id = yelp_categories.business_id
AND category <> 'Restaurants' AND category <> 'Food' AND category <> 'Bars' ;

CREATE VIEW checkinByID AS 
SELECT business_id, weekday, hour, COUNT(*) AS freq
FROM yelp_checkin 
GROUP BY business_id;

ALTER TABLE checkinByID ORDER BY business_id ASC;
ALTER TABLE restaurantID ORDER BY business_id ASC;

CREATE INDEX bid ON restaurantID(business_id(50) ASC);
CREATE INDEX bid ON checkinByID(business_id(50) ASC);
CREATE INDEX wd ON checkinByID(weekday ASC, hour ASC, business_ID(50)); 