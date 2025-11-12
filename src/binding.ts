export const Flags = {
  UNINITIALIZED: 0b0001,
  MUTABLE: 0b0010,
  DELETABLE: 0b0100,
  STRICT: 0b1000,
} as const;

export class Binding<T> {
  constructor(public value: T, public flags: number) {}
}
