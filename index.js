const express = require('express');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

// handle CORS related issues that you might face 
// when trying to access the api from different domains during development and testing
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

app.use((req, res, next) => {
  res.send('Welcome to Express')
});

app.listen(port, ()=> {
  console.log(`Server is running on port ${port}`)
});