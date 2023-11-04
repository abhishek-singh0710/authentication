// require("dotenv").config();

// const { Pool } = require("pg");

// const isProduction= process.env.NODE_ENV === "prodcution";

// const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

// const pool= new Pool({
//     connectionString: isProduction ? process.env.DATABASE_URL : connectionString
// });

// module.exports = { pool };

require("dotenv").config();

// const { Pool } = require("pg");

// const isProduction = process.env.NODE_ENV === "production"; // Corrected 'prodcution' to 'production'

// const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

// const pool = new Pool({
//     connectionString: isProduction ? process.env.DATABASE_URL : connectionString
// });

// module.exports = { pool };

const { Pool } = require('pg');

const pool = new Pool({
  user: 'root',
  host: 'dpg-cl2d2h2l7jac73fdn6ng-a.oregon-postgres.render.com',
  database: 'phc',
  password: 'Ikv6PF5INSV0HCLugPYqknBMyG6TOvRw',
  port: 5432, // Adjust the port as needed
  ssl: {
    rejectUnauthorized: true, // Enforce SSL certificate validation
  },
});

module.exports = { pool };

