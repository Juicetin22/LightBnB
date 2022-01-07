const { Pool } = require('pg');

const pool = new Pool({
  user: 'juicetin',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

const properties = require('./json/properties.json');
const users = require('./json/users.json');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = function(email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1;`, [email])
    .then((result) => {
      if (result.rows) {
        return result.rows[0];
      } else {
        return null
      }
    })
    .catch((err) => {
      console.log(err.message)
    });
};

exports.getUserWithEmail = getUserWithEmail;

//original js code without pg
/*
const getUserWithEmail = function(email) {
  let user;
  for (const userId in users) {
    user = users[userId];
    if (user.email.toLowerCase() === email.toLowerCase()) {
      break;
    } else {
      user = null;
    }
  }
  return Promise.resolve(user);
}
*/

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithId = function(id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1;`, [id])
    .then((result) => {
      if (result.rows[0]) {
        return result.rows[0];
      } else {
        return null
      }
    })
    .catch((err) => {
      console.log(err.message)
    });
};

exports.getUserWithId = getUserWithId;

//original js code without pg
/*
const getUserWithId = function(id) {
  return Promise.resolve(users[id]);
}
*/

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

const addUser = function(user) {
  return pool
    .query(`INSERT INTO users (name, email, password) 
            VALUES ($1, $2, $3) RETURNING *;`, 
            [user.name, user.email, user.password])
    .then((result) => result.rows[0])
    .catch((err) => {
      console.log(err.message)
    });
};

exports.addUser = addUser;

// original js code without pg
// const addUser =  function(user) {
//   const userId = Object.keys(users).length + 1;
//   user.id = userId;
//   users[userId] = user;
//   return Promise.resolve(user);
// }


/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */

const getAllReservations = function(guest_id, limit = 10) {
  return pool
  .query(`SELECT reservations.*, properties.*, avg(property_reviews.rating) as average_rating
  FROM property_reviews
  JOIN reservations ON reservations.property_id = property_reviews.property_id
  JOIN properties ON properties.id = reservations.property_id
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id
  ORDER BY start_date DESC
  LIMIT $2;`,
  [guest_id, limit])
  .then(result => result.rows)
  .catch((err) => {
    console.log(err.message)
  });
};
exports.getAllReservations = getAllReservations;

// testing - reservations without the avg rating
// const getAllReservations = function(guest_id, limit = 10) {
//   return pool
//     .query(`SELECT *
//             FROM reservations
//             JOIN properties ON properties.id = reservations.property_id
//             WHERE reservations.guest_id = $1
//             ORDER BY start_date DESC
//             LIMIT $2;`,
//             [guest_id, limit])
//     .then(result => result.rows)
//     .catch((err) => {
//       console.log(err.message)
//     });
// };

// original js code without pg
// const getAllReservations = function(guest_id, limit = 10) {
//   return getAllProperties(null, 2);
// }


/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

// const getAllProperties = (options, limit = 10) => {
//   return pool
//     .query(`SELECT properties.*, avg(property_reviews.rating) as average_rating
//             FROM properties 
//             JOIN property_reviews ON properties.id = property_id
//             GROUP BY properties.id
//             ORDER BY properties.id
//             LIMIT $1;`, 
//             [limit])
//     .then((result) => result.rows)
//     .catch((err) => {
//       console.log(err.message);
//     });
// };

const getAllProperties = function (options, limit = 10) {
  // 1 - set up array to hold parameters from users
  const queryParams = [];
  // 2 - start of query before the WHERE clause
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3 - filtering with the WHERE clause

  // if filtered by city
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  // for owners going to 'My Listings'
  if (options.owner_id && queryParams.length < 1) {
    queryParams.push(`${options.owner_id}`);
    queryString += `WHERE owner_id = $${queryParams.length} `;
  } else if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `AND owner_id = $${queryParams.length} `;
  }

  // if filtering by cost
  // only minimum price specified
  if (options.minimum_price_per_night && !options.maximum_price_per_night && queryParams.length < 1) {
    queryParams.push(`${options.minimum_price_per_night}`);
    queryString += `WHERE cost_per_night >= ($${queryParams.length} * 100) `;
  
  // only maximum price specified
  } else if (!options.minimum_price_per_night && options.maximum_price_per_night && queryParams.length < 1) {
    queryParams.push(`${options.maximum_price_per_night}`);
    queryString += `WHERE cost_per_night <= ($${queryParams.length} * 100) `;

  // both price specified but nothing prior
  } else if (options.minimum_price_per_night && options.maximum_price_per_night && queryParams.length < 1) {
    queryParams.push(`${options.minimum_price_per_night}`);
    queryString += `WHERE cost_per_night >= ($${queryParams.length} * 100) `;

    queryParams.push(`${options.maximum_price_per_night}`);
    queryString += `AND cost_per_night <= ($${queryParams.length} * 100) `;

  // minimum price but not maximum price specified
  } else if (options.minimum_price_per_night && !options.maximum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    queryString += `AND cost_per_night >= ($${queryParams.length} * 100) `;

  // maximum price but not minimum price specified
  } else if (!options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night}`);
    queryString += `AND cost_per_night <= ($${queryParams.length} * 100) `;

  // both minimum and maximum specified
  } else if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    queryString += `AND cost_per_night >= ($${queryParams.length} * 100) `;

    queryParams.push(`${options.maximum_price_per_night}`);
    queryString += `AND cost_per_night <= ($${queryParams.length} * 100) `;
  }

  // 4 - adding any query that comes after the WHERE clause
  // grouping data together by each property
  queryString += `
  GROUP BY properties.id
  `

  // if filtering by rating
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  }

  // parameterize query for limit
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5 - make sure everything is added correctly
  console.log(queryString, queryParams);

  // 6 - run the query
  return pool.query(queryString, queryParams).then((res) => res.rows);
};

exports.getAllProperties = getAllProperties;

//original js code with pg
// const getAllProperties = function(options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// }

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */

const addProperty = function(property) {
  const queryParams = [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms];

  const queryString = `INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
                       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;`
  
  return pool
    .query(queryString, queryParams)
    .then ((result) => result.rows[0])
    .catch((err) => {
      console.log(err.message)
    });
};

exports.addProperty = addProperty;

// original js code without pg
// const addProperty = function(property) {
//   const propertyId = Object.keys(properties).length + 1;
//   property.id = propertyId;
//   properties[propertyId] = property;
//   return Promise.resolve(property);
// }
