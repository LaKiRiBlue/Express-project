// index.js
const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const app = express();
dotenv.config(); // Load environment variables from .env file

const secretKey = process.env.SECRET_KEY;

var listFoodNames=[{name:'Sushi'},
                  {name:'Pizza'},
                  {name:'Bolognese'},
                  {name:'Brownies'}];

var listFoodDishes = [
    { name: listFoodNames[0].name, timeToPrepare: 10, ingredients: 'fish, rice', listOfSteps: 'do it' },
    { name: listFoodNames[1].name, timeToPrepare: 15, ingredients: 'dough, cheese', listOfSteps: 'put on and bake' },
    { name: listFoodNames[2].name, timeToPrepare: 25, ingredients: 'pasta, sauce, beef', listOfSteps: 'serve pasta with sauce' },
    { name: listFoodNames[3].name, timeToPrepare: 65, ingredients: 'flour, chocolate', listOfSteps: 'mix together and bake at 160deg' }
];

// Middleware to parse JSON in the request body
app.use(express.json());


// Get Particular route for a meal.
listFoodDishes.forEach(food => 
app.get('/'+food.name, (req, res) => {
  res.json( food);
}));

// Get General route for all the meal
app.get('/', (req, res) => {
  res.json( listFoodNames);
});

// POST route to send an email and generate a token
app.post('/generate-token', (req, res) => {
  const { email } = req.body;

  // Check if the email is provided in the request body
  if (!email) {
    return res.status(400).json({ error: 'Email not provided' });
  }

  // Create a token containing the email using JWT.sign
 console.log('Secret Key:', secretKey);
  const token = jwt.sign({ email }, secretKey);


  res.json({ token });
});

// POST route to send an meal and generate a token
app.post('/generate-token-meal', (req, res) => {
  const { meal } = req.body;

  // Check if the email is provided in the request body
  if (!meal) {
    return res.status(400).json({ error: 'meal not provided' });
  }

  // Create a token containing the email using JWT.sign
 console.log('Secret Key:', secretKey);
  const token = jwt.sign({ meal }, secretKey);


  res.json({ token });
});


// Middleware to validate the token
const validateToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error('   Error verifying token:', err);
      return res.status(500).json({ error: 'Error verifying token' });
    }

    // Attach the decoded email to the request object for further use
    req.email = decoded.email;
    req.meal = decoded.meal;
    next();
  });
};

// read the meal from toker
app.get('/protected-route-meal', validateToken, (req, res) => {
  // The email from the token will be available in req.email due to the validateToken middleware

  let i = 0;

while (i < listFoodDishes.length) {
    if (req.meal==listFoodDishes[i].name){
      res.json({ message: 'This is a token-protected route', food: listFoodDishes[i] });
    }
    i++;
} 

});

// Token-protected route
app.get('/protected-route', validateToken, (req, res) => {
  // The email from the token will be available in req.email due to the validateToken middleware
  res.json({ message: 'This is a token-protected route', email: req.email });
});

const port = 0;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
const server = app.listen(port, () => {
  const assignedPort = server.address().port;
  console.log(`Server is running on http://localhost:${assignedPort}`);
});


const path = require('path');

// Serve static files from the 'public' directory (optional)
app.use(express.static(path.join(__dirname, 'public')));

// Define a route for the info page
app.get('/info', (req, res) => {
  res.sendFile(path.join(__dirname, 'info.html'));
});
