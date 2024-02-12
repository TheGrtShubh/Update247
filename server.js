const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path'); // Import path module
const auth = require('./authController')
const admin = require('./adminController')
const use = require('./userSide')

const app = express();
const { PORT } = require('./config');

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// index page
app.get('/', async function(req, res) {
  var data = await use.fetchNews()
  var weather = await use.weather()

  res.render('pages/index', {
    data: data,
    weather: weather
  });
});

// login page
app.get('/login', (req, res) => {
  res.render('pages/login',{message :'Please provide your login details'});
});

// login form submission
app.post('/login', auth.loginUser);

// register page
app.get('/register', (req, res) =>{
  res.render('pages/register', {message: 'Please provide your details'})
})

app.post('/register', admin.insertUserData);

// admin landing
app.get('/admin', auth.authenticateToken, (req, res) => {
  res.render('pages/admin', { message: ""})
});

app.post('/admin', async (req, res) => {
  const { username, password, email } = req.body;
  await admin.insertUserData({username, password, email})
  res.render('pages/admin', { message: 'Insertion Successful' });
});

// admin adds news data
app.get('/addData', auth.authenticateToken, (req, res) => {
  res.render('pages/addData', { message: ""})
});

app.post('/addData', async (req, res) => {
  const { title, description } = req.body;
  await admin.insertNewsData({title, description})
  res.render('pages/addData', { message: 'Insertion Successful' });
});

// admin sees all data
app.get('/dataView', auth.authenticateToken, async (req, res) => {
  const data = await admin.fetchData()
  res.render('pages/dataView', { data: data })
});

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/')
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
