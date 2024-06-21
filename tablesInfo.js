



// C:\Users\user\Desktop\projects\wftd-express\tablesInfo.js

// C:\Users\user\Desktop\projects\wftd-express\tablesInfo.js

const { Pool } = require('pg');

class TablesInfoService {
  constructor(connectionString) {
    this.pool = new Pool({
      connectionString: connectionString,
    });
  }

  async getAllTableNames() {
    // Modified query to exclude system tables more effectively
    const query = `
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname!= 'information_schema' 
      AND tablename!~ '^pg_'`;
    return await this.pool.query(query);
  }

  async getColumnNamesForTable(tableName) {
    const query = 'SELECT column_name FROM information_schema.columns WHERE table_name = $1';
    return await this.pool.query(query, [tableName]);
  }

  async fetchTablesAndColumns() {
    try {
      const tablesResult = await this.getAllTableNames();
      const tables = tablesResult.rows.map(row => row.tablename);

      const tablesInfo = await Promise.all(
        tables.map(async tableName => {
          const columnsResult = await this.getColumnNamesForTable(tableName);
          return { tableName, columns: columnsResult.rows.map(row => row.column_name) };
        })
      );

      return tablesInfo;
    } catch (error) {
      console.error('Error fetching tables and columns:', error);
      throw error;
    }
  }
}

module.exports = TablesInfoService;