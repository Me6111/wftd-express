


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
    // Directly send the structured data obtained from fetchTablesAndColumns
    res.json(tablesInfo);
  } catch (error) {
    console.error('Error fetching tables and columns:', error);
    res.status(500).send('Internal Server Error');
  }
});
















app.post('/get_borders', async (req, res) => {
  try {
    console.log(`Full received data from client: ${JSON.stringify(req.body)}`, typeof req.body);
    console.log('--------------------------------------------------------------------------');
    const adm_units = ['country', 'state', 'city', 'zip'];
    const adm_unit = adm_units[req.body.adm_unit];
    const where_adm_unit = adm_units[req.body.where_adm_unit];
    const location = req.body.full_loc;
    const where_loc = location[req.body.where_adm_unit];
    let get_borders_qq;
    let where_loc_borders_qq;
    let borders = null;
    let where_loc_borders = null;
    if (JSON.stringify(location) === JSON.stringify([null, null, null, null])) {
      get_borders_qq = 'SELECT country, cleaned_geojson FROM country';
    } else {
      get_borders_qq = `
        SELECT ${adm_unit}, cleaned_geojson 
        FROM ${adm_unit} 
        WHERE ${where_adm_unit}_id = (
          SELECT ${where_adm_unit}_id 
          FROM ${where_adm_unit} 
          WHERE ${where_adm_unit} = '${where_loc}'
        )
      `;
      where_loc_borders_qq = `
        SELECT ${where_adm_unit}_id, ${where_adm_unit}, cleaned_geojson 
        FROM ${where_adm_unit} 
        WHERE ${where_adm_unit} = '${where_loc}'
      `;
      where_loc_borders = await execute_qq(where_loc_borders_qq);
    }
    borders = await execute_qq(get_borders_qq);
    res.send({'where_loc_borders': where_loc_borders,'borders': borders});
  } catch (err) {
    console.error(err);
    res.status(500).send('Error occurred');
  }
});











// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});