/**
 * @abstract 
 */
class Rating {
    constructor(){
        this.score = 0;
    }

    get score(){
        return this.score;
    }

    analyzeAndScore = (response)=>{
        
    };
}

module.exports.Rating = Rating;