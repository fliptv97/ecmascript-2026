import assert from "node:assert";
import { Binding, Flags as BindingFlags } from "../binding.js";
import { normalCompletion, throwCompletion } from "../completion.js";
import { UNDEF, UNUSED } from "../constants.js";
import { hasFlag } from "../utils.js";
import { Environment } from "./environment.js";

// https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-declarative-environment-records
export class DeclarativeEnvironment extends Environment {
  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-newdeclarativeenvironment
  constructor(outerEnv) {
    assert(outerEnv instanceof Environment || outerEnv === null);

    super();

    this._bindings = new Map();
    this.outerEnv = outerEnv;
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-declarative-environment-records-hasbinding-n
  hasBinding(name) {
    assert(typeof name == "string");

    return normalCompletion(this._bindings.has(name));
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-declarative-environment-records-createmutablebinding-n-d
  createMutableBinding(name, d) {
    assert(typeof name == "string");
    assert(typeof d == "boolean");

    assert(!this._bindings.has(name));

    const binding = new Binding(
      UNDEF,
      BindingFlags.UNINITIALIZED | BindingFlags.MUTABLE
    );

    if (d) {
      binding.flags |= BindingFlags.DELETABLE;
    }

    this._bindings.set(name, binding);

    return normalCompletion(UNUSED);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-declarative-environment-records-createimmutablebinding-n-s
  createImmutableBinding(name, isStrict) {
    assert(typeof name == "string");
    assert(typeof isStrict == "boolean");

    assert(!this._bindings.has(name));

    const binding = new Binding(UNDEF, BindingFlags.UNINITIALIZED);

    if (isStrict) {
      binding.flags |= BindingFlags.STRICT;
    }

    this._bindings.set(name, binding);

    return normalCompletion(UNUSED);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-declarative-environment-records-initializebinding-n-v
  initializeBinding(name, value) {
    assert(typeof name == "string");
    assert(this._bindings.has(name));

    const binding = this._bindings.get(name);

    assert(hasFlag(binding.flags, BindingFlags.UNINITIALIZED));

    binding.value = value;
    binding.flags ^= BindingFlags.UNINITIALIZED;

    return normalCompletion(UNUSED);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-declarative-environment-records-setmutablebinding-n-v-s
  setMutableBinding(name, value, isStrict) {
    assert(typeof name == "string");
    assert(typeof isStrict == "boolean");

    if (!this._bindings.has(name)) {
      if (isStrict) {
        return throwCompletion(new ReferenceError());
      }

      this.createImmutableBinding(name, true);
      this.initializeBinding(name, value);

      return normalCompletion(UNUSED);
    }

    const binding = this._bindings.get(name);

    if (hasFlag(binding.flags, BindingFlags.STRICT)) {
      isStrict = true;
    }

    if (hasFlag(binding.flags, BindingFlags.UNINITIALIZED)) {
      return throwCompletion(new ReferenceError());
    } else if (hasFlag(binding.flags, BindingFlags.MUTABLE)) {
      binding.value = value;
    } else {
      assert(!hasFlag(binding.flags, BindingFlags.MUTABLE));

      if (isStrict) {
        return throwCompletion(new TypeError());
      }
    }

    return normalCompletion(UNUSED);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-declarative-environment-records-getbindingvalue-n-s
  getBindingValue(name, isStrict) {
    assert(typeof name == "string");
    assert(typeof isStrict == "boolean");

    assert(this._bindings.has(name));

    const binding = this._bindings.get(name);

    if (hasFlag(binding.flags, BindingFlags.UNINITIALIZED)) {
      throw throwCompletion(new ReferenceError());
    }

    return normalCompletion(binding.value);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-declarative-environment-records-deletebinding-n
  deleteBinding(name) {
    assert(this._bindings.has(name));

    const binding = this._bindings.get(name);

    if (!hasFlag(binding.flags, BindingFlags.DELETABLE)) {
      return normalCompletion(false);
    }

    this._bindings.delete(name);

    return normalCompletion(true);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-declarative-environment-records-hasthisbinding
  hasThisBinding() {
    return false;
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-declarative-environment-records-hassuperbinding
  hasSuperBinding() {
    return false;
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-declarative-environment-records-withbaseobject
  withBaseObject() {
    return undefined;
  }
}
