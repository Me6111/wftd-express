


// C:\Users\user\Desktop\projects\wftd-express\index.js


const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Dynamically set allowed origins based on environment
const allowedOrigins = ['http://localhost:3000']; // Add other origins as needed
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.get('/hello', (req, res) => {
  res.send('Hello client');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});