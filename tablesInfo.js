



// C:\Users\user\Desktop\projects\wftd-express\tablesInfo.js


const { Pool } = require('pg');

class TablesInfoService {
  constructor(connectionString) {
    this.pool = new Pool({
      connectionString: connectionString,
    });
  }

  async getAllTableNames() {
    const query = 'SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname!= \'information_schema\'';
    return await this.pool.query(query);
  }

  async getAllColumnNames(tableName) {
    const query = 'SELECT column_name FROM information_schema.columns WHERE table_name = $1';
    return await this.pool.query(query, [tableName]);
  }

  async fetchTablesAndColumns() {
    try {
      const tablesResult = await this.getAllTableNames();
      const tables = tablesResult.rows.map(row => row.tablename);

      const columnsPromises = tables.map(async tableName => {
        const columnsResult = await this.getAllColumnNames(tableName);
        return { tableName, columns: columnsResult.rows.map(row => row.column_name) };
      });

      const columnsResults = await Promise.all(columnsPromises);

      const tablesInfo = columnsResults.map(result => ({
        tableName: result.tableName,
        columns: result.columns
      }));

      return tablesInfo;
    } catch (error) {
      console.error('Error fetching tables and columns:', error);
      throw error;
    }
  }
}

module.exports = TablesInfoService;