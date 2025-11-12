export function hasFlag(bitmask: number, mask: number): boolean {
  return (bitmask & mask) === mask;
}
