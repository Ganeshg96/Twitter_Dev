const express =require('express');
const connect= require('./config/database');
const app= express();

const TweetRepository=require('./repository/tweet-repository');
const Comment= require('./models/comment');

app.listen(3000, async() =>{
    console.log('server started');
    await connect();
    console.log('Mongo db connected');
    // const tweet= await Tweet.create({
    //     content:'third tweet'    
    // });
    //const tweets= await Tweet.find({userEmail:'a@bc.com'});
    // const tweet= await Tweet.findById('669f79e88974cc34a4ff4c54');
    // tweet.userEmail='b@c.com';
    // await tweet.save();
    const tweetRepo = new TweetRepository();
    const tweet = await tweetRepo.getAll(0, 4);
    console.log(tweet[3].contentWithEmail);
});