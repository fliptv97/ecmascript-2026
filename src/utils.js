/**
 * @param {number} bitmask
 * @param {number} mask
 * @returns {boolean}
 */
export function hasFlag(bitmask, mask) {
  return (bitmask & mask) === mask;
}
