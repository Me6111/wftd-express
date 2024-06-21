


// C:\Users\user\Desktop\projects\wftd-express\app.js


const express = require('express');
const cors = require('cors');
const TablesInfoService = require('./tablesInfo'); // Ensure this path is correct
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());

const tablesInfoService = new TablesInfoService(process.env.DATABASE_URL);

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
    const tablesInfo = await tablesInfoService.fetchTablesAndColumns();
    // Since tablesInfo is an array of objects containing tableName and columns,
    // we map over it to create a single object with tables and columns arrays.
    const responseObj = {
      tables: tablesInfo.map(info => info.tableName),
      columns: tablesInfo.flatMap(info => info.columns)
    };
    res.json(responseObj);
  } catch (error) {
    console.error('Error fetching tables and columns:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});