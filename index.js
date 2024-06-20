


// C:\Users\user\Desktop\projects\wftd-express\index.js


const express = require('express');
const app = express();
const port = 3000;

app.get('/hello', (req, res) => {
  res.send('Hello client');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});