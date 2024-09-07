import { TweetRepository, HashtagRepository } from '../repository/index.js';

class TweetService {
    constructor() {
        this.tweetRepository = new TweetRepository();
        this.hashtagRepository = new HashtagRepository();
    }

    async create(data) {
        const content = data.content;
        const tags = content.match(/#[a-zA-Z0-9_]+/g)
                    .map(tag => tag.substring(1).toLowerCase()); // extract hashtags

        const tweet = await this.tweetRepository.create(data);

        // Get existing tags from the repository
        let alreadyPresentTags = await this.hashtagRepository.findByName(tags);

        // Extract the titles of the existing tags
        const existingTagTitles = alreadyPresentTags.map(tag => tag.title);

        // Identify the new tags (those not already present)
        let newTags = tags.filter(tag => !existingTagTitles.includes(tag));
        newTags = newTags.map(tag => ({
            title: tag,
            tweets: [tweet.id]
        }));

        // Bulk create new tags
        await this.hashtagRepository.bulkCreate(newTags);

        // Update existing tags with the new tweet id
        for (let tag of alreadyPresentTags) {
            if (!tag.tweets.includes(tweet.id)) {
                tag.tweets.push(tweet.id); // Ensure no duplicates
                await tag.save(); // Save the updated tag
            }
        }

        return tweet;
    }

    async get(tweetId) {
        const tweet = await this.tweetRepository.getWithComments(tweetId);
        return tweet;
    }
}

export default TweetService;
