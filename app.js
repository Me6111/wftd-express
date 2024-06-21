


// C:\Users\user\Desktop\projects\wftd-express\app.js


const express = require('express');
const cors = require('cors'); 
const app = express();
const port = 3000;

app.use(cors()); 

app.get('/hello', (req, res) => {
  res.send('Hello client');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});