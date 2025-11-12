import { normalCompletion, throwCompletion } from "../completion-record";
import { UNDEF, UNUSED } from "../constants";
import { DeclarativeEnvironmentRecord } from "./declarative-environment-record";

export const ThisBindingStatus = {
  LEXICAL: "LEXICAL",
  INITIALIZED: "INITIALIZED",
  UNINITIALIZED: "UNINITIALIZED",
};

class Function_ {}

// https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-function-environment-records
export class FunctionEnvironmentRecord extends DeclarativeEnvironmentRecord {
  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-newfunctionenvironment
  constructor(F, newTarget) {
    assert(F instanceof Function_);
    assert(typeof newTarget == "object" || newTarget === undefined);

    this.functionObject = F;

    this.thisBindingStatus =
      F.thisMode == "LEXICAL"
        ? ThisBindingStatus.LEXICAL
        : ThisBindingStatus.UNINITIALIZED;
    this.newTarget = newTarget;
    this.outerEnv = F.environment;
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-bindthisvalue
  bindThisValue(value) {
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
      return false;
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

    return home.getPrototypeOf();
  }
}
