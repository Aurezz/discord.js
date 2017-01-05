const Long = require('long');

// Discord epoch (2015-01-01T00:00:00.000Z)
const EPOCH = 1420070400000;
let INCREMENT = 0;

function pad(v, n, c = '0') {
  return String(v).length >= n ? String(v) : (String(c).repeat(n) + v).slice(-n);
}

 /**
  * A deconstructed snowflake
  * @typedef {Object} DeconstructedSnowflake
  * @property {Date} date Date in the snowflake
  * @property {number} workerID Worker id in the snowflake
  * @property {number} processID Process id in the snowflake
  * @property {number} increment Increment in the snowflake
  * @property {string} binary Binary representation of the snowflake
  */

  /**
   * A Twitter snowflake, except the epoch is 2015-01-01T00:00:00.000Z
   * ```
   * If we have a snowflake '266241948824764416' we can represent it as binary:
   *
   * 64                                          22     17     12          0
   *  000000111011000111100001101001000101000000  00001  00000  000000000000
   *       number of ms since discord epoch       worker  pid    increment
   * ```
   * Note: this generator hardcodes the worker id as 1 and the process id as 0
   * @typedef {string} Snowflake
   * @class Snowflake
   */
class Snowflake {
  /**
   * Generate a Discord snowflake
   * @returns {Snowflake} The generated snowflake
   */
  static generate() {
    if (INCREMENT >= 4095) INCREMENT = 0;
    const BINARY = `${pad((Date.now() - EPOCH).toString(2), 42)}0000100000${pad((INCREMENT++).toString(2), 12)}`;
    return Long.fromString(BINARY, 2).toString();
  }

  /**
   * Deconstruct a Discord snowflake
   * @param {Snowflake} snowflake Snowflake to deconstruct
   * @returns {DeconstructedSnowflake} Deconstructed snowflake
   */
  static deconstruct(snowflake) {
    const BINARY = pad(Long.fromString(snowflake).toString(2), 64);
    return {
      date: new Date(parseInt(BINARY.substring(0, 42), 2) + EPOCH),
      workerID: parseInt(BINARY.substring(42, 47), 2),
      processID: parseInt(BINARY.substring(47, 52), 2),
      increment: parseInt(BINARY.substring(52, 64), 2),
      binary: BINARY,
    };
  }
}

module.exports = Snowflake;