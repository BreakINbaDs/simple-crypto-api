
CREATE TABLE coins (
  ID SERIAL PRIMARY KEY,
  code VARCHAR(10),
  price DECIMAL,
  user_id BIGINT
);
