import { EMPTY } from "./constants.ts";

export type NormalCompletion<T> = CompletionRecord<T, typeof EMPTY>;
export function normalCompletion<T>(value: T) {
  return new CompletionRecord(Type.NORMAL, value, EMPTY);
}

export type ThrowCompletion<T> = CompletionRecord<T, typeof EMPTY>;
export function throwCompletion<T>(value: T) {
  return new CompletionRecord(Type.THROW, value, EMPTY);
}

export type ReturnCompletion<T> = CompletionRecord<T, typeof EMPTY>;
export function returnCompletion<T>(value: T) {
  return new CompletionRecord(Type.RETURN, value, EMPTY);
}

export const Type = {
  BREAK: "BREAK",
  CONTINUE: "CONTINUE",
  NORMAL: "NORMAL",
  RETURN: "RETURN",
  THROW: "THROW",
} as const;

type TType = keyof typeof Type;

// https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-completion-record-specification-type
export class CompletionRecord<T, U> {
  constructor(public type: TType, public value: T, public target: U) {}
}
