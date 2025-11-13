import assert from "node:assert";
import { Flags as BindingFlags, IndirectBinding } from "../binding.js";
import { normalCompletion, throwCompletion } from "../completion-record.js";
import { EMPTY, UNUSED } from "../constants.js";
import { ModuleRecord } from "../module-record.js";
import { hasFlag } from "../utils.js";
import { DeclarativeEnvironmentRecord } from "./declarative-environment-record.js";

// https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-module-environment-records
export class ModuleEnvironmentRecord extends DeclarativeEnvironmentRecord {
  getBindingValue(name, isStrict) {
    assert(typeof name == "string");
    assert(typeof isStrict == "boolean");

    assert(isStrict == true);
    assert(this._bindings.has(name));

    const binding = this._bindings.get(name);

    if (binding instanceof IndirectBinding) {
      const targetEnv = binding.moduleRecord.environment;

      if (targetEnv == EMPTY) {
        return throwCompletion(new ReferenceError());
      }

      return targetEnv.getBindingValue(binding.name, true);
    }

    if (hasFlag(binding.flags, BindingFlags.UNINITIALIZED)) {
      return throwCompletion(new ReferenceError());
    }

    return normalCompletion(binding.value);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-module-environment-records-deletebinding-n
  deleteBinding() {}

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-module-environment-records-hasthisbinding
  hasThisBinding() {
    return true;
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-module-environment-records-getthisbinding
  getThisBinding() {
    return normalCompletion(undefined);
  }

  // https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html#sec-createimportbinding
  createImportBinding(name, moduleRecord, name2) {
    assert(typeof name == "string");
    assert(moduleRecord instanceof ModuleRecord);
    assert(typeof name2 == "string");

    assert(!this._bindings.has(name));

    this._bindings.set(name, new IndirectBinding(moduleRecord, name2));

    return UNUSED;
  }
}
