/**
 * @param {string} text 
 * @returns {number}
 */
function countWords(text) {
  return text.replace(/<[^>]+>/, "").trim().split(/\s+/).length;
}

/**
 * Calvulate the reading time based on words
 * @param {string} text
 * @param {number} wpm  Words per minute (default: 225)
 * @returns {number}
 */
function calculateReadingTime(text, wpm=225) {
  return Math.ceil(countWords(text) / wpm);
}

module.exports = {
  countWords: countWords,
  calculateReadingTime: calculateReadingTime,
};