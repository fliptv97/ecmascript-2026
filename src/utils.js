/**
 * @param {number} bitmask
 * @param {number} mask
 * @returns {boolean}
 */
export function hasFlag(bitmask, mask) {
  return (bitmask & mask) === mask;
}

// https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-isdatadescriptor
export function IsDataDescriptor(desc) {
  if (Object.hasOwn(desc, "value")) return true;
  if (Object.hasOwn(desc, "writable")) return true;

  return false;
}
