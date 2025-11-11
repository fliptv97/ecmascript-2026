import { EMPTY } from "./constants.js";

export function normalCompletion(value) {
  return new CompletionRecord(Type.NORMAL, value, EMPTY);
}

export function throwCompletion(value) {
  return new CompletionRecord(Type.THROW, value, EMPTY);
}

export function returnCompletion(value) {
  return new CompletionRecord(Type.RETURN, value, EMPTY);
}

export const Type = {
  BREAK: "BREAK",
  CONTINUE: "CONTINUE",
  NORMAL: "NORMAL",
  RETURN: "RETURN",
  THROW: "THROW",
};

// https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type
export class CompletionRecord {
  constructor(type, value, target) {
    if (!Object.hasOwn(Type, type)) {
      throw new TypeError(
        `expected type (${Object.keys(Type).join(", ")}), received: "${type}"`
      );
    }

    if (value instanceof CompletionRecord) {
      throw new TypeError("value can't be of type CompletionRecord");
    }

    if (typeof target != "string" && target !== EMPTY) {
      throw new TypeError("target should be a string or an EMPTY");
    }

    this.type = type;
    this.value = value;
    this.target = target;
  }
}
