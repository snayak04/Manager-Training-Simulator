/**
 * @abstract 
 */
class Rating {
    constructor(){
        this.score = 0;
    }

    /**
     * @returns the score
     */
    get score(){
        return this.score;
    }
    
    /**
     * This is to be called within assignTask function. 
     * @param context {make out the intents from the assistant context}
     * @returns int {score based on agile practice}
     */
    analyzeAndScore(response){
        throw new error("Abstract method, needs to be implemented by concrete class");
    };
}

module.exports.Rating = Rating;