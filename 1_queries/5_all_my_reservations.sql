SELECT reservations.*, properties.*, avg(property_reviews.rating) as average_rating
  FROM property_reviews
  JOIN reservations ON reservations.property_id = property_reviews.property_id
  JOIN properties ON properties.id = reservations.property_id
  WHERE reservations.guest_id = 1 AND end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT 10;


-- SELECT properties.*, reservations.*, avg(rating) as average_rating
-- FROM reservations
-- JOIN properties ON reservations.property_id = properties.id
-- JOIN property_reviews ON properties.id = property_reviews.property_id
-- WHERE reservations.guest_id = 1
-- AND reservations.end_date < now()::date
-- GROUP BY properties.id, reservations.id
-- ORDER BY reservations.start_date
-- LIMIT 10;

-- SELECT reservations.*, properties.*, avg(property_reviews.rating) as average_rating
--   FROM property_reviews
--   JOIN reservations ON reservations.id = reservation_id
--   JOIN properties ON properties.id = property_reviews.property_id
--   JOIN users ON users.id = property_reviews.guest_id
--   WHERE users.id = 1 AND end_date < now()::date
--   GROUP BY properties.id, reservations.id
--   ORDER BY start_date
--   LIMIT 10;