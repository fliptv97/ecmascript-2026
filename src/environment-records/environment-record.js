// https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-environment-records
export class EnvironmentRecord {
  hasBinding(_n) {}

  createMutableBinding(_n, _d) {}

  createImmutableBinding(_n, _s) {}

  initializeBinding(_n, _v) {}

  setMutableBinding(_n, _v, _s) {}

  getBindingValue(_n, _s) {}

  deleteBinding(_n) {}

  hasThisBinding() {}

  hasSuperBinding() {}

  withBaseObject() {}
}

/* An Object Environment Record is used to define the effect of ECMAScript
elements such as WithStatement that associate identifier bindings with
the properties of some object. */
class ObjectEnvironmentRecord extends EnvironmentRecord {}

/* A Global Environment Record is used for Script global declarations.
It does not have an outer environment; its [[OuterEnv]] is null.
It may be prepopulated with identifier bindings and it includes an associated
global object whose properties provide some of the global environment's
identifier bindings. As ECMAScript code is executed, additional properties
may be added to the global object and the initial properties may be modified. */
class GlobalEnvironmentRecord extends EnvironmentRecord {}
