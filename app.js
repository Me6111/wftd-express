


// C:\Users\user\Desktop\projects\wftd-express\app.js


const express = require('express');
const cors = require('cors');
const app = express();

// Use the port provided by Railway
const port = process.env.PORT || 3000; // Fallback to 3000 for local development

app.use(cors());

app.get('/hello', (req, res) => {
  res.send('Hello client');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
