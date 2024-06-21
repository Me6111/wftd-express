// C:\Users\user\Desktop\projects\wftd-express\app.js

// Import required modules
const express = require('express');
const cors = require('cors'); // Middleware for handling Cross-Origin Resource Sharing (CORS)
const app = express();
const port = 3000;

// Configure CORS middleware explicitly
// Note: For production, replace '*' with your specific domain(s) for better security
app.use(cors({
  origin: '*', // Allow all origins for development/testing; consider specifying domains in production
  credentials: true, // Reflects credentials in the response
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specifies allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allows specific headers
}));

// Define a simple route
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello client' }); // Sending JSON response instead of plain text
});

// Error handling middleware
// This catches any errors thrown in the application and sends a generic error message
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});