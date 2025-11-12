// https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-environment-records
export abstract class EnvironmentRecord {
  abstract hasBinding(_name: string): void;

  abstract createMutableBinding(_name: string, _d: boolean): void;

  abstract createImmutableBinding(_name: string, _isStrict: boolean): void;

  abstract initializeBinding<T>(_name: string, _value: T): void;

  abstract setMutableBinding<T>(
    _name: string,
    _value: T,
    _isStrict: boolean
  ): void;

  abstract getBindingValue(_name: string, _isStrict: boolean): void;

  abstract deleteBinding(_name: string): void;

  abstract hasThisBinding(): void;

  abstract hasSuperBinding(): void;

  abstract withBaseObject(): void;
}

/* An Object Environment Record is used to define the effect of ECMAScript
elements such as WithStatement that associate identifier bindings with
the properties of some object. */
// class ObjectEnvironmentRecord extends EnvironmentRecord {}

/* A Global Environment Record is used for Script global declarations.
It does not have an outer environment; its [[OuterEnv]] is null.
It may be prepopulated with identifier bindings and it includes an associated
global object whose properties provide some of the global environment's
identifier bindings. As ECMAScript code is executed, additional properties
may be added to the global object and the initial properties may be modified. */
// class GlobalEnvironmentRecord extends EnvironmentRecord {}
