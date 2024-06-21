


// C:\Users\user\Desktop\projects\wftd-express\app.js


const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Import Pool from pg
const app = express();

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

// Tables-info route
app.get('/tables-info', async (req, res) => {
  try {
    // Function to get all table names
    const getAllTableNames = async () => {
      const query = 'SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname!= \'information_schema\'';
      return await pool.query(query);
    };

    // Function to get all column names for a specific table
    const getAllColumnNames = async (tableName) => {
      const query = 'SELECT column_name FROM information_schema.columns WHERE table_name = $1';
      return await pool.query(query, [tableName]);
    };

    // Get all table names
    const tablesResult = await getAllTableNames();
    const tables = tablesResult.rows.map(row => row.tablename);

    // For each table, get its column names
    const columnsPromises = tables.map(async tableName => {
      const columnsResult = await getAllColumnNames(tableName);
      return { tableName, columns: columnsResult.rows.map(row => row.column_name) };
    });

    // Wait for all promises to resolve
    const columnsResults = await Promise.all(columnsPromises);

    // Extract just the table names and columns for response
    const tablesInfo = columnsResults.map(result => ({
      tableName: result.tableName,
      columns: result.columns
    }));

    // Send the response
    res.json({ tables: tablesInfo.map(info => info.tableName), columns: tablesInfo.map(info => info.columns) });
  } catch (error) {
    console.error('Error fetching tables and columns:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});