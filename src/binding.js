import { UNUSED } from "./constants.js";

export const Flags = {
  UNINITIALIZED: 0b0001,
  MUTABLE: 0b0010,
  DELETABLE: 0b0100,
  STRICT: 0b1000,
};

export class Binding {
  constructor(value = UNUSED, flags) {
    this.value = value;
    this.flags = flags;
  }
}

export class IndirectBinding {
  #moduleRecord;
  #name;

  constructor(moduleRecord, name) {
    this.#moduleRecord = moduleRecord;
    this.#name = name;
  }

  get moduleRecord() {
    return this.#moduleRecord;
  }

  get name() {
    return this.#name;
  }
}
