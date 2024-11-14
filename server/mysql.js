const mysql = require('mysql2');

// Create a connection to the database
const mysqlConnection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',   // Database host (localhost by default)
    user: process.env.DB_USER || 'root',        // Database user
    password: process.env.DB_PASSWORD || 'kritin',    // Database password
    database: process.env.DB_NAME || 'movie_booking_system',  // Database name
    port: process.env.DB_PORT || 3306          // Port (3306 is default for MySQL)
});

// Establish the connection
mysqlConnection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);  // Exit if unable to connect
    }
    console.log('Connected to the MySQL database');
});

module.exports = mysqlConnection;
