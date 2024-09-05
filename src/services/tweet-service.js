const { TweetRepository, HashtagRepository } = require('../repository/index')

class TweetService {
    constructor() {
        this.tweetRepository = new TweetRepository();
        this.hashtagRepository= new HashtagRepository();
    }

    async create(data) {
        const content = data.content;
        const tags = content.match(/#[a-zA-Z0-9_]+/g).map((tag) => tag.substring(1));; // this regex extracts hashtags
        const tweet = await this.tweetRepository.create(data);
        let alreadyPresentTags= await this.hashtagRepository.findByName(tags);
        alreadyPresentTags=alreadyPresentTags.map(tags => tags.title);
        let newTags= tags.filter(tag => !alreadyPresentTags.includes(tag));
        newTags = newTags.map(tag =>{
            return {title:tag, tweets:[tweet.id]}
        });

        await this.hashtagRepository.bulkCreate(newTags);
        alreadyPresentTags.forEach((tag) =>{
            tag.tweets.push(tweet.id);
            tag.save();
        });
        return tweet;
    }
}

module.exports = TweetService;

/*
    this is my #first #tweet . I am really #excited
*/