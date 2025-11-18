import assert from "node:assert";
import {
  Completion,
  normalCompletion,
  throwCompletion,
} from "../completion.js";
import { UNUSED } from "../constants.js";
import { IsDataDescriptor } from "../utils.js";
import { DeclarativeEnvironment } from "./declarative-environment.js";
import { Environment } from "./environment.js";
import { ObjectEnvironment } from "./object-environment.js";

export class GlobalEnvironment extends Environment {
  #objectRecord;
  #globalThisValue;
  #declarativeRecord;
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: will be used in future
  #outerEnv;

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-newglobalenvironment
  /**
   * @param {Object} g
   * @param {Object} thisValue
   */
  constructor(g, thisValue) {
    assert(typeof g === "object" && g !== null);
    assert(typeof thisValue === "object" && g !== null);

    super();

    const objRec = new ObjectEnvironment(g, false, null);
    const dclRec = new DeclarativeEnvironment(null);

    this.#objectRecord = objRec;
    this.#globalThisValue = thisValue;
    this.#declarativeRecord = dclRec;
    this.#outerEnv = null;
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-global-environment-records-hasbinding-n
  /**
   * @param {string} name
   * @returns {Completion}
   */
  hasBinding(name) {
    assert(typeof name === "string");

    const dclRec = this.#declarativeRecord;

    if (dclRec.hasBinding(name).value) {
      return normalCompletion(true);
    }

    const objRec = this.#objectRecord;

    return objRec.hasBinding(name);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-global-environment-records-createmutablebinding-n-d
  /**
   * @param {string} name
   * @param {boolean} d
   * @returns {Completion}
   */
  createMutableBinding(name, d) {
    assert(typeof name === "string");
    assert(typeof d === "boolean");

    const dclRec = this.#declarativeRecord;

    if (dclRec.hasBinding(name)) {
      return throwCompletion(
        new TypeError(`binding with name: "${name} already exists"`),
      );
    }

    return dclRec.createMutableBinding(name, d);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-global-environment-records-createimmutablebinding-n-s
  /**
   * @param {string} name
   * @param {boolean} isStrict
   * @returns {Completion}
   */
  createImmutableBinding(name, isStrict) {
    assert(typeof name === "string");
    assert(typeof isStrict === "boolean");

    const dclRec = this.#declarativeRecord;

    if (dclRec.hasBinding(name).value) {
      return throwCompletion(
        new TypeError(`immutable binding with name "${name}" already exists`),
      );
    }

    return dclRec.createImmutableBinding(name, isStrict);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-global-environment-records-initializebinding-n-v
  /**
   * @param {string} name
   * @param {T} value
   * @returns {Completion}
   */
  initializeBinding(name, value) {
    assert(typeof name === "string");

    const dclRec = this.#declarativeRecord;

    if (dclRec.hasBinding(name).value) {
      return dclRec.initializeBinding(name, value);
    }

    const objRec = this.#objectRecord;

    return objRec.initializeBinding(name, value);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-global-environment-records-setmutablebinding-n-v-s
  /**
   * @param {string} name
   * @param {T} value
   * @param {boolean} isStrict
   * @returns {Completion}
   */
  setMutableBinding(name, value, isStrict) {
    assert(typeof name === "string");
    assert(typeof isStrict === "boolean");

    const dclRec = this.#declarativeRecord;

    if (dclRec.hasBinding(name).value) {
      return dclRec.setMutableBinding(name, value, isStrict);
    }

    const objRec = this.#objectRecord;

    return objRec.setMutableBinding(name, value, isStrict);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-global-environment-records-getbindingvalue-n-s
  /**
   * @param {string} name
   * @param {boolean} isStrict
   * @returns {Completion}
   */
  getBindingValue(name, isStrict) {
    assert(typeof name === "string");
    assert(typeof isStrict === "boolean");

    const dclRec = this.#declarativeRecord;

    if (dclRec.hasBinding(name).value) {
      return dclRec.getBindingValue(name, isStrict);
    }

    const objRec = this.#objectRecord;

    return objRec.getBindingValue(name, isStrict);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-global-environment-records-deletebinding-n
  /**
   * @param {string} name
   * @returns {Completion}
   */
  deleteBinding(name) {
    assert(typeof name === "string");

    const dclRec = this.#declarativeRecord;

    if (dclRec.hasBinding(name).value) {
      return dclRec.deleteBinding(name);
    }

    const objRec = this.#objectRecord;
    const globalObject = objRec.bindingObject;
    const existingProp = name in globalObject;

    if (existingProp) {
      return objRec.deleteBinding(name);
    }

    return normalCompletion(true);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-global-environment-records-hasthisbinding
  /**
   * @returns {true}
   */
  hasThisBinding() {
    return true;
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-global-environment-records-hassuperbinding
  /**
   * @returns {false}
   */
  hasSuperBinding() {
    return false;
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-global-environment-records-withbaseobject
  /**
   * @returns {undefined}
   */
  withBaseObject() {
    return undefined;
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-global-environment-records-getthisbinding
  /**
   * @returns {Object}
   */
  getThisBinding() {
    return this.#globalThisValue;
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-haslexicaldeclaration
  /**
   * @param {string} name
   * @returns {Completion}
   */
  hasLexicalDeclaration(name) {
    assert(typeof name === "string");

    return this.#declarativeRecord.hasBinding(name);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-hasrestrictedglobalproperty
  /**
   * @param {string} name
   * @returns {Completion}
   */
  hasRestrictedGlobalProperty(name) {
    assert(typeof name === "string");

    const objRec = this.#objectRecord;
    const globalObject = objRec.bindingObject;
    const existingProp = Object.getOwnPropertyDescriptor(globalObject, name);

    if (existingProp === undefined) {
      return normalCompletion(undefined);
    }

    if (existingProp.configurable) {
      return normalCompletion(false);
    }

    return normalCompletion(true);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-candeclareglobalvar
  /**
   * @param {string} name
   * @returns {Completion}
   */
  canDeclareGlobalVar(name) {
    assert(typeof name === "string");

    const objRec = this.#objectRecord;
    const globalObject = objRec.bindingObject;
    const hasProperty = Object.hasOwn(globalObject, name);

    if (hasProperty) {
      return normalCompletion(true);
    }

    return normalCompletion(Object.isExtensible(globalObject));
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-candeclareglobalfunction
  /**
   * @param {string} name
   * @returns {Completion}
   */
  canDeclareGlobalFunction(name) {
    assert(typeof name === "string");

    const objRec = this.#objectRecord;
    const globalObject = objRec.bindingObject;
    const existingProp = Object.getOwnPropertyDescriptor(globalObject, name);

    if (existingProp === undefined) {
      return normalCompletion(Object.isExtensible(globalObject));
    }

    if (existingProp.configurable) {
      return normalCompletion(true);
    }

    if (
      IsDataDescriptor(existingProp) &&
      existingProp.writable &&
      existingProp.enumerable
    ) {
      return normalCompletion(true);
    }

    return normalCompletion(false);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-createglobalvarbinding
  /**
   * @param {string} name
   * @param {boolean} d
   * @returns {Completion}
   */
  createGlobalVarBinding(name, d) {
    assert(typeof name === "string");
    assert(typeof d === "boolean");

    const objRec = this.#objectRecord;
    const globalObject = objRec.bindingObject;
    const hasProperty = Object.hasOwn(globalObject, name);
    const extensible = Object.isExtensible(globalObject);

    if (!hasProperty && extensible) {
      objRec.createMutableBinding(name, d);
      objRec.initializeBinding(name, undefined);
    }

    return normalCompletion(UNUSED);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-createglobalfunctionbinding
  /**
   * @param {string} name
   * @param {T} value
   * @param {boolean} d
   * @returns {Completion}
   */
  createGlobalFunctionBinding(name, value, d) {
    assert(typeof name === "string");
    assert(typeof d === "boolean");

    const objRec = this.#objectRecord;
    const globalObject = objRec.bindingObject;
    const existingProp = Object.getOwnPropertyDescriptor(globalObject, name);
    const desc =
      existingProp === undefined || existingProp.configurable
        ? {
            value,
            writable: true,
            enumerable: true,
            configurable: d,
          }
        : {
            value,
          };

    Object.defineProperty(globalObject, name, desc);

    globalObject[name] = value;

    return normalCompletion(UNUSED);
  }
}
