import { normalCompletion, throwCompletion } from "../completion-record";
import { UNDEF, UNUSED } from "../constants";
import { DeclarativeEnvironmentRecord } from "./declarative-environment-record";

export const ThisBindingStatus = {
  LEXICAL: "LEXICAL",
  INITIALIZED: "INITIALIZED",
  UNINITIALIZED: "UNINITIALIZED",
};

// https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-bindthisvalue
export function bindThisValue(envRec, value) {
  assert(envRec instanceof FunctionEnvironmentRecord);
  assert(envRec._thisBindingStatus != ThisBindingStatus.LEXICAL);

  if (envRec._thisBindingStatus == ThisBindingStatus.INITIALIZED) {
    return throwCompletion(new ReferenceError());
  }

  envRec._thisValue = value;
  envRec._thisBindingStatus = ThisBindingStatus.INITIALIZED;

  return normalCompletion(UNUSED);
}

// https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-getsuperbase
export function getSuperBase(envRec) {
  assert(envRec instanceof FunctionEnvironmentRecord);

  const home = envRec.functionObject.homeObject;

  if (home === undefined) {
    return undefined;
  }

  assert(typeof home == "object");

  return home.getPrototypeOf();
}

// https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-function-environment-records
export class FunctionEnvironmentRecord extends DeclarativeEnvironmentRecord {
  thisValue = UNDEF;
  thisBindingStatus = UNDEF;
  functionObject = UNDEF;
  newTarget = UNDEF;

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
}
