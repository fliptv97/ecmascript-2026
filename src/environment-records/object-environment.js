import assert from "node:assert";
import { normalCompletion, throwCompletion } from "../completion.js";
import { UNUSED } from "../constants.js";
import { Environment } from "./environment.js";

// https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-object-environment-records
export class ObjectEnvironment extends Environment {
  #bindingObject;
  #isWithEnvironment;
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: will be used in future
  #outerEnv;

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-newobjectenvironment
  /**
   * @param {object | null} bindingObject
   * @param {boolean} isWithEnvironment
   * @param {Environment} outerEnv
   */
  constructor(bindingObject, isWithEnvironment, outerEnv) {
    assert(typeof bindingObject === "object" && bindingObject != null);
    assert(typeof isWithEnvironment === "boolean");
    assert(outerEnv instanceof Environment || outerEnv === null);

    super();

    this.#bindingObject = bindingObject;
    this.#isWithEnvironment = isWithEnvironment;
    this.#outerEnv = outerEnv;
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-object-environment-records-hasbinding-n
  hasBinding(name) {
    assert(typeof name === "string");

    const bindingObject = this.#bindingObject;
    const foundBinding = name in bindingObject;

    if (!foundBinding) {
      return normalCompletion(false);
    }

    if (!this.#isWithEnvironment) {
      return normalCompletion(true);
    }

    const unscopables = bindingObject[Symbol.unscopables];

    if (typeof unscopables === "object" && unscopables != null) {
      const blocked = Boolean(unscopables[name]);

      if (blocked) {
        return normalCompletion(false);
      }
    }

    return normalCompletion(true);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-object-environment-records-createmutablebinding-n-d
  createMutableBinding(name, d) {
    assert(typeof name === "string");
    assert(typeof d === "boolean");

    const bindingObject = this.#bindingObject;

    Object.defineProperty(bindingObject, name, {
      value: undefined,
      writable: true,
      enumerable: true,
      configurable: d,
    });

    return normalCompletion(UNUSED);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-object-environment-records-initializebinding-n-v
  initializeBinding(name, value) {
    assert(typeof name === "string");

    this.setMutableBinding(name, value, false);

    return normalCompletion(UNUSED);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-object-environment-records-setmutablebinding-n-v-s
  setMutableBinding(name, value, isStrict) {
    assert(typeof name === "string");
    assert(typeof isStrict === "boolean");

    const bindingObject = this.#bindingObject;
    const stillExists = name in bindingObject;

    if (!stillExists && isStrict) {
      return throwCompletion(
        new ReferenceError("can't set value of non-existing property"),
      );
    }

    bindingObject[name] = value;

    return normalCompletion(UNUSED);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-object-environment-records-createmutablebinding-n-d
  getBindingValue(name, isStrict) {
    assert(typeof name === "string");
    assert(typeof isStrict === "boolean");

    const bindingObject = this.#bindingObject;
    const value = name in bindingObject;

    if (!value) {
      if (!isStrict) {
        return normalCompletion(undefined);
      }

      return throwCompletion(
        new ReferenceError("can't get value of non-existent property"),
      );
    }

    return normalCompletion(bindingObject[name]);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-object-environment-records-deletebinding-n
  deleteBinding(name) {
    assert(typeof name === "string");

    const isDeletionSuccessful = delete this.#bindingObject[name];

    return normalCompletion(isDeletionSuccessful);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-object-environment-records-hasthisbinding
  hasThisBinding() {
    return false;
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-object-environment-records-hassuperbinding
  hasSuperBinding() {
    return false;
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-object-environment-records-withbaseobject
  withBaseObject() {
    if (this.#isWithEnvironment) {
      return this.#bindingObject;
    }

    return undefined;
  }
}
