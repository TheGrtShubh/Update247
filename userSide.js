// Connect to MongoDB
const {MongoClient} = require('mongodb');
const assert = require('assert');
const {url, dbName, apiKey} = require('./config');
const client = new MongoClient(url);

async function fetchNews(){
    await client.connect()
    const dbo = client.db(dbName)
    const collection = dbo.collection('newsData')
    const data = await collection.find({}).limit(3).sort({$natural:-1}).toArray()
    //console.log(typeof(data))
    return data
}

async function weather(){
    //const apiKey = '';
    const city = 'London'
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Unable to fetch weather data');
        }
        const data = await response.json();
        data.main.temp = (data.main.temp - 273.15).toFixed(1) + '\u00B0C'
        data.main.temp_max = (data.main.temp_max - 273.15).toFixed(1) + '\u00B0C'
        data.main.temp_min = (data.main.temp_min - 273.15).toFixed(1) + '\u00B0C'
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        return null;
    }
}

module.exports={
    fetchNews,
    weather
}
//var re = fetchNews()
//console.log(typeof(re))