// Connect to MongoDB
const {MongoClient} = require('mongodb');
const assert = require('assert');
const {url, dbName} = require('./config');
const client = new MongoClient(url);

async function fetchData(){
    await client.connect()
    const dbo = client.db(dbName)
    const collection = dbo.collection('newsData')
    const data = await collection.find({}).toArray()
    return data
}

async function insertNewsData({title, description}){
    await client.connect()
    const dbo = client.db(dbName)
    const collection = dbo.collection('newsData')
    const data = await collection.insertOne({title, description})
    client.close();
}

async function insertUserData({username, password, email}){
    await client.connect()
    const dbo = client.db(dbName)
    const collection = dbo.collection('logindata')
    const data = await collection.insertOne({username, password, email})
    client.close();
}

module.exports= {
    fetchData,
    insertNewsData,
    insertUserData,
}