import { LikeRepository, TweetRepository } from '../repository/index.js';
import Tweet from '../models/tweet.js';

class LikeService {
    constructor() {
        this.likeRepository = new LikeRepository();
        this.tweetRepository = new TweetRepository();
    }

    async toggleLike(modelId, modelType, userId) { // /api/v1/likes/toggle?id=modelid&type=Tweet
        console.log(modelId, modelType, userId);
        
        let likeable;
        if (modelType === 'Tweet') {
            likeable = await this.tweetRepository.get(modelId);
        } else if (modelType === 'Comment') {
            // TODO
            throw new Error('Comment model is not yet implemented');
        } else {
            throw new Error('unknown model type');
        }

        const exists = await this.likeRepository.findByUserAndLikeable({
            user: userId,
            onModel: modelType,
            likeable: modelId
        });

        console.log("exists", exists);
        if (exists) {
            likeable.likes.pull(exists._id);
            await likeable.save();
            await this.likeRepository.destroy(exists._id);  // Use 'destroy' method
            var isAdded = false;
        } else {
            const newLike = await this.likeRepository.create({
                user: userId,
                onModel: modelType,
                likeable: modelId
            });
            likeable.likes.push(newLike);
            await likeable.save();
            var isAdded = true;
        }

        return isAdded;
    }
}

export default LikeService;
