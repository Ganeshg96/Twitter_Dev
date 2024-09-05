const express =require('express');
const connect= require('./config/database');
const app= express();

const Tweet = require('./models/tweet');

app.listen(3000, async() =>{
    console.log('server started');
    await connect();
    console.log('Mongo db connected');
    const tweets= await Tweet.find({
        content: ["first tweet", "my tweet", "virat kohli 18"]
        
    });
    console.log(tweets);
});