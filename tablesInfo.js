



// C:\Users\user\Desktop\projects\wftd-express\tablesInfo.js


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
  
      const tablesResult = await getAllTableNames();
      const tables = tablesResult.rows.map(row => row.tablename);
  
      const columnsPromises = tables.map(async tableName => {
        const columnsResult = await getAllColumnNames(tableName);
        return { tableName, columns: columnsResult.rows.map(row => row.column_name) };
      });
  
      const columnsResults = await Promise.all(columnsPromises);
  
      const tablesInfo = columnsResults.map(result => ({
        tableName: result.tableName,
        columns: result.columns
      }));
  
      res.json({ tables: tablesInfo.map(info => info.tableName), columns: tablesInfo.map(info => info.columns) });
    } catch (error) {
      console.error('Error fetching tables and columns:', error);
      res.status(500).send('Internal Server Error');
    }
});