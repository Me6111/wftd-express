



// C:\Users\user\Desktop\projects\wftd-express\tablesInfo.js


// This code assumes the `pool` variable is already defined and has a working connection to your database.

app.get('/tables-info', async (req, res) => {
    try {
      const getAllTableNames = async () => {
        const query = 'SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname!= \'information_schema\'';
        return await pool.query(query);
      };
  
      const getAllColumnNames = async (tableName) => {
        const query = 'SELECT column_name FROM information_schema.columns WHERE table_name = $1';
        return await pool.query(query, [tableName]);
      };
  
      // Fetch table names
      const tablesResult = await getAllTableNames();
      const tables = tablesResult.rows.map(row => row.tablename);
  
      // Fetch column names for each table in parallel
      const columnsPromises = tables.map(async tableName => {
        const columnsResult = await getAllColumnNames(tableName);
        return { tableName, columns: columnsResult.rows.map(row => row.column_name) };
      });
  
      // Wait for all column fetches to complete
      const columnsResults = await Promise.all(columnsPromises);
  
      // Combine table and column information
      const tablesInfo = columnsResults.map(result => ({
        tableName: result.tableName,
        columns: result.columns
      }));
  
      // Send JSON response with table and column information
      res.json({ tables: tablesInfo.map(info => info.tableName), columns: tablesInfo.map(info => info.columns) });
    } catch (error) {
      console.error('Error fetching tables and columns:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  