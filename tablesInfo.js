



// C:\Users\user\Desktop\projects\wftd-express\tablesInfo.js


// tablesInfo.js

const { Pool } = require('pg'); // Import Pool from pg (assuming this is needed)

// Function to get all table names
const getAllTableNames = async (pool) => {
  const query = 'SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname!= \'information_schema\'';
  return await pool.query(query);
};

// Function to get all column names for a specific table
const getAllColumnNames = async (pool, tableName) => {
  const query = 'SELECT column_name FROM information_schema.columns WHERE table_name = $1';
  return await pool.query(query, [tableName]);
};

// Function to define the '/tables-info' endpoint
module.exports = (app) => {
  app.get('/tables-info', async (req, res) => {
    try {
      const { pool } = req; // Assuming the pool is accessible in the request object 

      // Get all table names
      const tablesResult = await getAllTableNames(pool);
      const tables = tablesResult.rows.map(row => row.tablename);

      // For each table, get its column names
      const columnsPromises = tables.map(async tableName => {
        const columnsResult = await getAllColumnNames(pool, tableName);
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
};
