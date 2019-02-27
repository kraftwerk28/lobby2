DROP TABLE IF EXISTS stats;

CREATE TABLE stats (
  record_id SERIAL PRIMARY KEY,
  platform VARCHAR(40),
  ip VARCHAR(15),
  req_time TIMESTAMP,
  country VARCHAR(20),
  city VARCHAR(20),
  org VARCHAR(100),
  latitude NUMERIC(10, 7),
  longtitude NUMERIC(10, 7)
);
