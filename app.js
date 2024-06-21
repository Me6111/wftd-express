// C:\Users\user\Desktop\projects\wftd-express\app.js

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Configure CORS middleware explicitly
app.use(cors({
  origin: '*', // Allow all origins for development/testing
  credentials: true, // Reflects credentials in the response
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specifies allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allows specific headers
}));

app.get('/hello', (req, res) => {
  res.send('Hello client');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});