


// C:\Users\user\Desktop\projects\wftd-express\app.js


const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Import Pool from pg
const app = express();
const { getTablesInfo } = require('./tablesInfo.js'); // Import the function


// Use the port provided by Railway
const port = process.env.PORT || 3000; // Fallback to 3000 for local development

app.use(cors());

// Initialize the database connection using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Root path route
app.get('/', (req, res) => {
  res.send('Hello from the root path!');
});

// Hello route
app.get('/hello', (req, res) => {
  res.send('Hello client');
});



// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});