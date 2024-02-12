// Connect to MongoDB
const {MongoClient} = require('mongodb');
const assert = require('assert');
const {url, dbName} = require('./config');
const client = new MongoClient(url);

// Secret key for JWT
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key';

function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    // Check if token is provided
    if (!token) return res.status(401).send('Access Denied');
  
    // Verify token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(403).send('Invalid token');
        req.user = decoded;
        next();
    });
  }

async function loginUser(req, res){
    const { username, password } = req.body;

    await client.connect()
    const dbo = client.db(dbName)
    const collection = dbo.collection('logindata')
    const data = await collection.findOne({username, password})

    if (data) {
        // Generate JWT
        const token = jwt.sign({ userId: data._id }, secretKey);
      
        // Send JWT as a response
        res.cookie('token', token, { httpOnly : true});
        res.redirect('/admin');
      } else {
        res.render('pages/login', { message: 'Invalid username or password' });
      }
    client.close();
}


module.exports = {
    loginUser,
    authenticateToken
}