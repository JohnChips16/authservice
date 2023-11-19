const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
  user: 'Johnny16',
  host: 'localhost',
  database: 'authservice',
  password: 'JLasmi25',
  port: 5432, // Default PostgreSQL port is 5432
  max: 20, // Set the maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds of inactivity
  connectionTimeoutMillis: 2000, // Attempt to connect for 2 seconds (2000 ms)
});


module.exports=pool