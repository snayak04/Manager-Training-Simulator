
function AgileRating() {
    this.score = 0;
}

/**
 * @returns this.score
 */
AgileRating.prototype.getScore = () => {
    return this.score;
};

/**
 * Always listens whenever a response is sent by Assistant API.
 * @param {JSON object that is returned by the IBM Assistant} context 
 */
AgileRating.prototype.listen = (context) => {
    console.log(context);
};

module.exports = AgileRating;