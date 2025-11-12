import assert from "node:assert";
import { normalCompletion, throwCompletion } from "../completion-record.ts";
import { UNUSED } from "../constants.ts";
import { Function_, ThisMode as FunctionThisMode } from "../stubs/function.ts";
import { DeclarativeEnvironmentRecord } from "./declarative-environment-record.ts";

export const ThisBindingStatus = {
  LEXICAL: "LEXICAL",
  INITIALIZED: "INITIALIZED",
  UNINITIALIZED: "UNINITIALIZED",
} as const;

// https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-function-environment-records
export class FunctionEnvironmentRecord extends DeclarativeEnvironmentRecord {
  functionObject: Function_;
  thisBindingStatus: keyof typeof ThisBindingStatus;
  thisValue: unknown;
  newTarget: Object | undefined;

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-newfunctionenvironment
  constructor(F: Function_, newTarget: Object | undefined = undefined) {
    super(F.environment);

    this.functionObject = F;

    this.thisBindingStatus =
      F.thisMode == FunctionThisMode.LEXICAL
        ? ThisBindingStatus.LEXICAL
        : ThisBindingStatus.UNINITIALIZED;
    this.newTarget = newTarget;
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-bindthisvalue
  bindThisValue<T>(value: T) {
    assert(this.thisBindingStatus != ThisBindingStatus.LEXICAL);

    if (this.thisBindingStatus == ThisBindingStatus.INITIALIZED) {
      return throwCompletion(new ReferenceError());
    }

    this.thisValue = value;
    this.thisBindingStatus = ThisBindingStatus.INITIALIZED;

    return normalCompletion(UNUSED);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-function-environment-records-hasthisbinding
  hasThisBinding() {
    return normalCompletion(
      this.thisBindingStatus !== ThisBindingStatus.LEXICAL
    );
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-function-environment-records-hassuperbinding
  hasSuperBinding() {
    if (this.thisBindingStatus === ThisBindingStatus.LEXICAL) {
      return normalCompletion(false);
    }

    return normalCompletion(this.functionObject.homeObject !== undefined);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-function-environment-records-getthisbinding
  getThisBinding() {
    assert(this.thisBindingStatus !== ThisBindingStatus.LEXICAL);

    if (this.thisBindingStatus === ThisBindingStatus.UNINITIALIZED) {
      return throwCompletion(new ReferenceError());
    }

    return normalCompletion(this.thisValue);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-getsuperbase
  getSuperBase() {
    const home = this.functionObject.homeObject;

    if (home === undefined) {
      return undefined;
    }

    assert(typeof home == "object");

    return Object.getPrototypeOf(home);
  }
}
