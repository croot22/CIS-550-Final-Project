CREATE TABLE incidents (
  objectid int NOT NULL,
  dc_dist int NOT NULL,
  dispatch_date varchar(50) NOT NULL,
  ucr_general int NOT NULL,
  text_general_code varchar(100) NOT NULL,
  PRIMARY KEY (objectid),
  KEY dc_dist_idx (dc_dist),
  KEY distindex (dc_dist),
  CONSTRAINT dc_dist FOREIGN KEY (dc_dist) REFERENCES districts (dc_dist)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE districts (
  dc_dist int NOT NULL,
  zipcode int NOT NULL,
  PRIMARY KEY (dc_dist)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE covid (
  zipcode int NOT NULL,
  result varchar(45) NOT NULL,
  count int NOT NULL,
  PRIMARY KEY (zipcode,result)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE population (
  zipcode int NOT NULL,
  population int NOT NULL,
  PRIMARY KEY (zipcode)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci